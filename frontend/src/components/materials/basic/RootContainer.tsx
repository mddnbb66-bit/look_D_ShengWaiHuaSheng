import { ComponentNodeType } from "@/core/schema/ownType";
import { PageDSL } from "@/core/schema/page";

/**
 * 根容器：就是画布本身（白布 + 网格），里面放页面上的所有组件
 */
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
			{/* 把子节点交回给 Renderer 去画 */}
			{renderChildren(pageNode.children ?? [])}
		</div>
	);
}
