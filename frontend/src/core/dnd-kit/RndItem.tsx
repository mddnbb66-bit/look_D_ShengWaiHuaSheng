// 这个文件选中后的一些操作 也就是管理这份组件的位置与交互
import { Rnd } from "react-rnd";
// 上面的个东西包住的组件可以，支持拖拽改变宽高和支持拖动位置
import { ComponentNodeType } from "../schema/ownType";
import { useSchemaStore } from "@/store/schema-store";
import { useGuideStore } from "@/store/guide-store";
import { useCallback } from "react";
import { SelectionOverLay } from "../rnd/SelectionOverLay";
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
export function RndItem({ nodeData, children, scale = 1 }: RndItemProps) {
	const selectedId = useSchemaStore((state) => state.selectedId);
	const setSelectedId = useSchemaStore((state) => state.setSelectedId);
	const updateItem = useSchemaStore((state) => state.updateNode);
	const removeItem = useSchemaStore((state) => state.removeNode);
	const gridSize = useSchemaStore((state) => state.schema?.settings?.gridSize);
	const setAvtiveSnaps = useGuideStore((state) => state.setActiveSnaps);
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
	const handleDrag = () => {};
	const handleDragStop = () => {};
	const handleResizeStop = () => {};
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
