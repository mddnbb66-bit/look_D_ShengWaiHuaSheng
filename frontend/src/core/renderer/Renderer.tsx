import { ReactNode } from "react";
import { ComponentNodeType } from "../schema/ownType";
import type { PageDSL } from "../schema/page";
import { RootContainerComponent } from "@/components/materials/basic/RootContainer";
import { NodeRenderer } from "./NodeRenderer";
// Renderer 自己收到的参数（和物料组件的 RendererProps 不是一回事）
interface SchemaRendererProps {
	schema: PageDSL; //整个页面
}
/**
 * 我传了个 schema = {[text1,text2]}
 * 就是{schema:[text1,text2]}
 */
// 传进来的数据长这样
// {
// 	schema: {
// 		type: "RootContainer",
// 		settings: { /* ... */ },
// 		children: [text1, text2]
// 	}
// }
export function Renderer({ schema }: SchemaRendererProps): ReactNode {
	// 下面就是   ([text1, text2]) => 先text1 => <NodeRenderer node={text1}再是text2 />;
	const renderChildren = (children: ComponentNodeType[]) =>
		children.map((child) => <NodeRenderer key={child.id} node={child} />);
	// 最后返回根容器
	return <RootContainerComponent node={schema} renderChildren={renderChildren} />;
}
// 子渲染器 ->渲染子节点
// 根渲染器 -> 渲染根节点
// renderChildren里面调用子渲染器
// 先 根渲染器把渲染函数带下去 -> 根容器调用renderChildren -> NodeRenderer渲染合适的子组件->套到根容器->index用Renderer得到渲染好的根容器
