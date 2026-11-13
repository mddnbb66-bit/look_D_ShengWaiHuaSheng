// 这个文件选中后的一些操作 也就是管理这份组件的位置与交互
import { Rnd, type RndDragCallback } from "react-rnd";
// 上面的个东西包住的组件可以，支持拖拽改变宽高和支持拖动位置
import { ComponentNodeType } from "../schema/ownType";
import { useSchemaStore } from "@/store/schema-store";
import { useGuideStore } from "@/store/guide-store";
import { useCallback } from "react";
import { SelectionOverLay } from "../rnd/SelectionOverLay";
import { snapToGrid, DEFAULT_GRID_SIZE } from "../utils/grid";
import type { DraggableData, ResizableDelta, Position } from "react-rnd";
import type { DraggableEvent } from "react-draggable";
interface RndItemProps {
	// 当前渲染的节点数据
	nodeData: ComponentNodeType;
	// 要渲染真实业务组件（文本、容器等）
	children: React.ReactNode;
	// 画布缩放倍率，传给 Rnd 以修正拖拽/缩放坐标
	scale?: number;
}
/**
 * @param nodeData 当前渲染的节点数据
 * @param children 要渲染真实业务组件
 * @returns 一个包着内容的 React 元素
 * <Rnd>	负责拖动、调整宽高的外层
		<div>	承载点击选中等操作
			{children}	实际显示
		</div>
	</Rnd>
 */
export function RndItem({ nodeData, children }: RndItemProps) {
	const scale = useSchemaStore((state) => state.scale);
	const selectedId = useSchemaStore((state) => state.selectedId);
	const setSelectedId = useSchemaStore((state) => state.setSelectedId);
	const updateItem = useSchemaStore((state) => state.updateNode);
	const removeItem = useSchemaStore((state) => state.removeNode);
	const gridSize = useSchemaStore((state) => state.schema?.settings?.gridSize);
	const setAvtiveSnaps = useGuideStore((state) => state.setActiveSnaps);
	const step = gridSize ?? DEFAULT_GRID_SIZE;
	// 兜底的样式，防御 style 为空的情况，避免 Rnd 报错
	const style = nodeData.style ?? {
		top: 0,
		left: 0,
		width: 200,
		height: 50,
		zIndex: 1,
	};
	// 我包装的节点，是不是全局当前选中的节点？
	let isSelect = nodeData.id === selectedId;
	//往上太挤了就反转
	let isReverseTop = style.top <= 5;
	//组件正在移动时持续触发
	/**
	 *
	 * @param _event 	鼠标事件可以带有 clientX、`clientY` 等信息
	 * @param nodeData  `x、`y`、本次位移 deltaX/deltaY 等 是库整理好的数据
	 */
	const handleDrag: RndDragCallback = (_e: DraggableEvent, dragData: DraggableData) => {
		//分别计算2个方向的吸附位置
		const snapX = snapToGrid(dragData.x, step);
		const snapY = snapToGrid(dragData.y, step);
		// 本次需要显示的参考线
		const lines: { xOy: "x" | "y"; value: number }[] = [];
		lines.push({ xOy: "x", value: snapX.originPosition });
		lines.push({ xOy: "y", value: snapY.originPosition });
		//保存到显示数组中
		setAvtiveSnaps(lines);
	};
	/** 拖拽结束时同步最新坐标到 schema */
	/**
	 * @param data一般是这样{
		  node,    // 被拖拽的 DOM 元素
		  x,       // 当前横坐标
		  y,       // 当前纵坐标
		  deltaX,  // 本次横向移动距离
		  deltaY,  // 本次纵向移动距离
		  lastX,   // 上一次横坐标
		  lastY    // 上一次纵坐标
				}
	 */
	const handleDragStop = (_e: DraggableEvent, dragData: DraggableData) => {
		setAvtiveSnaps([]);
		const snapLeft = snapToGrid(dragData.x, step).originPosition;
		const snapTop = snapToGrid(dragData.y, step).originPosition;
		updateItem(nodeData.id, { style: { ...style, left: snapLeft, top: snapTop } });
	};
	//单个组件缩放结束时触发
	/** 单个缩放结束时同步最新尺寸与坐标到 schema */
	// 用户拖动组件边缘
	//         ↓
	// Rnd 改变组件大小
	//         ↓
	// 用户松开鼠标
	//         ↓
	// 触发 handleResizeStop
	//         ↓
	// 读取新宽高和位置
	//         ↓
	// 吸附到网格
	//         ↓
	// 保存到 schema
	// 不是为了能缩放
	// 缩放结束
	// → 获取最终尺寸
	// → 对齐网格
	// → 写回 schema
	// → 保证数据、保存结果和画面一致
	/**
	 *
	 * @param ref 	当前被缩放的 HTML 元素，用.可以获得获取缩放后的尺寸，就是ref.offset
	 * @param position	//缩放后的坐标
	 */
	//_是为了因对包的检查要求，无奈
	const handleResizeStop = (
		_e: MouseEvent | TouchEvent,
		_direction: string,
		ref: HTMLElement,
		_delta: ResizableDelta, //表示这次缩放尺寸变化了多少，是怎量
		position: Position
	) => {
		//改变缩放后的宽高
		const changeSacleWidth = snapToGrid(ref.offsetWidth, step).originPosition;
		const changeSacleHeight = snapToGrid(ref.offsetHeight, step).originPosition;
		//左上角缩放的处理
		const snapLeft = snapToGrid(position.x, step).originPosition;
		const snapTop = snapToGrid(position.y, step).originPosition;
		updateItem(nodeData.id, {
			style: {
				...style,
				width: changeSacleWidth,
				height: changeSacleHeight,
				left: snapLeft,
				top: snapTop,
			},
		});
	};
	//处理选中
	const handleSelect = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedId(nodeData.id);
		console.log(nodeData.id, "我已经选中");
	};
	//处理删除
	const handleDelete = (event: React.MouseEvent) => {
		event.stopPropagation();
		removeItem(nodeData.id);
		console.log("我已经删除");
	};
	//处理取消
	const handleCancel = (event: React.MouseEvent) => {
		event.stopPropagation();
		setSelectedId(null);
	};

	return (
		<Rnd
			size={{ width: style.width, height: style.height }}
			position={{ x: style.left, y: style.top }}
			bounds="parent" //不允许子组件拖出去
			scale={scale}
			disableDragging={nodeData.id !== selectedId} //没选中的组件禁止拖动。
			enableResizing={nodeData.id === selectedId} //只有选中的组件允许缩放。
			style={{ zIndex: style.zIndex }}
			onDrag={handleDrag} //组件正在移动时持续触发
			onDragStop={handleDragStop} //组件移动结束时触发
			onResizeStop={handleResizeStop} //组件缩放结束时触发
		>
			{/* 内层容器负责点击选中、高亮边框和标签区域 */}
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
				}}
				onClick={handleSelect}
			>
				{isSelect && (
					<SelectionOverLay
						name={nodeData.name || nodeData.type}
						isReverseTop={isReverseTop}
						onCancel={handleCancel}
						onDelete={handleDelete}
					/>
				)}
				{children}
			</div>
		</Rnd>
	);
}
