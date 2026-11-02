import { useDroppable } from "@dnd-kit/core";
import { useRef } from "react";
//把画布/容器组件注册成可放置区域
interface DroppableItemProps {
	id: string; //画布id
	children: React.ReactNode;
	style?: React.CSSProperties; //驼峰的css
}
export function DroppableItem({ id, children, style }: DroppableItemProps) {
	const nodeRef = useRef<HTMLElement | null>(null);
	const { setNodeRef, isOver } = useDroppable({
		id,
	});
	// 设置悬停时的默认样式 绿色

	const handleRef = (node: HTMLDivElement | null) => {
		nodeRef.current = node;
		setNodeRef(node);
	};
	return (
		<div ref={handleRef} className="h-full relative  w-full">
			{children}
			{isOver && (
				<div
					className="z-10 inset-0 absolute pointer-events-none"
					style={{ backgroundColor: "rgba(0,128,0,0.15)" }}
				></div>
			)}
		</div>
	);
}
