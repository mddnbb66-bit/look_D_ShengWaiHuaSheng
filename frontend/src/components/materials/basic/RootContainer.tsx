import { Renderer } from "@/core/renderer/Renderer";
import { ComponentNodeType } from "@/core/schema/ownType";
import { PageDSL } from "@/core/schema/page";

/**
 * 根容器：就是画布本身（白布 + 网格），里面放页面上的所有组件
 */
// 传进来的数据
// {
// 	node: {
// 		type: "RootContainer",
// 		settings: { /* ... */ },
// 		children: [text1, text2]
// 	},

// 	renderChildren: (children) =>
//		children.map((child) => (
//			<NodeRenderer key={child.id} node={child} />
//		))
// }
export function RootContainerComponent({
	node,
	renderChildren,
}: {
	node: PageDSL;
	renderChildren: (children: ComponentNodeType[]) => React.ReactNode;
}) {
	const pageNode = node as PageDSL;
	return (
		<div
			style={{
				position: "relative",
				width: pageNode.settings.width,
				height: pageNode.settings.height,
				backgroundColor: pageNode.settings.backgroundColor || "#ffffff",
			}}
		>
			{/* 网格背景：从 editor/index.tsx 搬过来的 */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					pointerEvents: "none", // 鼠标穿透，不挡住下面的组件
					backgroundImage:
						"linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
					backgroundSize: "15px 15px",
				}}
			/>
			{/*到这一步开始画字节点 比如renderChildren([text1,text2])*/}
			{/* 这一步是在jsx中直接写函数就像{add(1)}一样 */}
			{renderChildren(pageNode.children ?? [])}
		</div>
	);
}
// 根容器返回的内容
//<div /* 白布：relative、设计宽高、背景色 */>
//	<div /* 网格层 */ />
//
//	<NodeRenderer key="1145" node={text1} />
//	<NodeRenderer key="1146" node={text2} />
//</div>
