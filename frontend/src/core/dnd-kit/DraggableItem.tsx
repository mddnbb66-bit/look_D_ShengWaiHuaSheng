// DraggableItem 移动原卡片	SVG＋边框＋“文字组件”
import { useDraggable } from "@dnd-kit/core";
interface DraggableItemProps {
	componentType: string;
	children: React.ReactNode;
}
export function DraggableItem({ componentType, children }: DraggableItemProps) {
	const { listeners, transform, attributes, setNodeRef } = useDraggable({ id: componentType });
	// listeners:让元素能接收拖拽操作
	//attributes：一些默认的属性比如 role,比如tabIndex
	// setNodeRef:告诉库“具体拖哪个元素” 直接用ref 挂载
	// transform: 当前拖动的位移数据	{ x: 80, y: 20 }
	const style = transform
		? {
				transform: `translate3d(${transform.x}px,${transform.y}px,1px)`,
				zIndex: 20,
			}
		: undefined;
	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			{children}
		</div>
	);
}
// dnd-kit 提供 x/y 位移数据
//         ↓
// 转换成 CSS transform 字符串
//         ↓
// 应用到真实 DOM
//         ↓
// 让元素视觉上跟随鼠标移动
