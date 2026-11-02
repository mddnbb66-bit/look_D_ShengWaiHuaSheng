/**
 * @param DragStartEvent 拖拽开始时的数据类型
 * @param DragEndEvent 	拖拽结束时的数据类型
 * @param DragOverlay 拖拽过程中的视觉预览
 * @param DndContext	拖拽系统的上下文容器，类似一个总控制器。
 */
import { getNewComponentConfig } from "@/config/configMap";
import { DndContext, DragOverlay, type DragStartEvent, type DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import { useSchemaStore } from "@/store/schema-store";
import { nanoid } from "nanoid";
import { Schema } from "mongoose";
export function DndWrapper({ children, scale = 1 }: { children: React.ReactNode; scale?: number }) {
	// 下面的东西是显示拖拽预览的东西，置为null，不影响event.active.id 这个真正的东西
	const [activeType, setActiveType] = useState<string | null>(null);
	const schemaStore = useSchemaStore();

	const handleDragStart = (event: DragStartEvent) => {
		// TODO: 需要新增组件config，拖拽开始时，深拷贝一份拖拽组件对应config，在useDraggable中注册数据
		// 目前仅做调试输出，真正的实例 id 在拖拽结束时统一生成，保证「每次成功拖拽一个新实例就得到一个全新的 id」
		console.log("DragStartEvent:", event);
		//这个id就是ComponentType，只是注册的时候必须写id
		//event.active    // 正在拖的那个来源的信息对象
		setActiveType(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		// 下面的东西是显示拖拽预览的东西 先取消掉
		setActiveType(null);
		//下面是落点源的id
		const dropItemId = event.over?.id;
		if (!dropItemId) return;
		//根据id(type)获取配置
		const newConfig = getNewComponentConfig(event.active.id as any);
		// 获取外层可视工作区的滚动信息
		const viewport = document.getElementById("viewport");
		const scrollLeft = viewport?.scrollLeft ?? 0;
		const scrollTop = viewport?.scrollTop ?? 0;
		// 拖拽元素的目标容器相对于浏览器视口左上角的位置
		const overPosition = event.over?.rect;

		// 放置的目标元素相对于浏览器视口左上角的相对位置
		const newNodePosition = event.active.rect.current?.translated;
		// 还原成大画布坐标系
		const x = (newNodePosition!.left - overPosition!.left + scrollLeft) / scale;
		const y = (newNodePosition!.top - overPosition!.top + scrollTop) / scale;
		const newStyle = { left: x, top: y };
		newConfig.style = { ...newConfig.style, ...newStyle };
		// 落下去生成全新的id
		newConfig.id = nanoid();
		schemaStore.addNode(schemaStore.schema?.id, newConfig);
	};

	// event.over          → 这次命中的接收区域
	// event.over.data     → 库保存的自定义数据引用
	// event.over.data.current → 你当初传入的那份 data 对象

	// 拖拽被取消（例如 ESC 或拖拽到无效区域）时重置状态
	const handleDragCancel = () => {
		setActiveType(null);
	};
	// 	dnd-kit 处理取消操作
	//    ├─ 清理库内部的拖拽状态
	//    ├─ 让 useDraggable 的拖动位移恢复
	//    └─ 调用你提供的 handleDragCancel，通知你清理自己的状态
	return (
		<DndContext
			onDragStart={handleDragStart} //拖拽开始时触发这个回调 下面是结束的时候
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel} //拖拽取消时触发。比如拖到无效区域后取消
		>
			{children}
			<DragOverlay dropAnimation={null}>
				{/* DragOverlay 渲染 {activeType} */}

				{activeType && (
					<div
						style={{
							zIndex: 9999,
							pointerEvents: "none",
						}}
					>
						{/* TODO: 此处可根据 activeType 渲染对应组件的真实预览内容 */}
						{activeType}
					</div>
				)}
			</DragOverlay>
		</DndContext>
	);
}
