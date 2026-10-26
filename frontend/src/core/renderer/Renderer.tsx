import { ReactNode } from "react";
import { ComponentNodeType } from "../schema/ownType";
import { componentRegistryMap, type RegistryOkCommponent } from "@/components/materials/registry";
import type { PageDSL } from "../schema/page";
//兜底的未知组件
const unKnowComponent = ({ node }: any) => {
	return <div style={{ color: "red" }}>未知组件,类型是{node.type}</div>;
};
// Renderer 自己收到的参数（和物料组件的 RendererProps 不是一回事）
interface SchemaRendererProps {
	schema: ComponentNodeType | ComponentNodeType[] | PageDSL; // 单个节点 / 一组节点 / 整个页面
}
/**
 * 我传了个 schema = {[text1,text2]}
 * 就是{schema:[text1,text2]}
 *
 * @param 到手了给解构出schema=[text1,text2]的组，然后变量
 * @returns
 */

export function Renderer({ schema }: SchemaRendererProps): ReactNode {
	if (Array.isArray(schema)) {
		//递归遍历一个个，外层return 是为了立刻结束函数，后面的代码都不执行
		return schema.map((node) => {
			return <Renderer schema={node} key={node.id} />;
		});
	}
	//node就是Text1，Text2这种下面是单个节点的处理
	const renderComponent = componentRegistryMap.get(schema.type) ?? unKnowComponent;
	const renderChildren = (children: ComponentNodeType[]) => <Renderer schema={children} />;
	const content = renderComponent({ node: schema, renderChildren }); //新建一个对象，键叫 node，值是变量 schema 里装的东西。
	// 新增：根容器就是画布本身，不用包
	if (schema.type === "RootContainer") return content;
	return <div style={{ position: "absolute", ...schema.style }}>{content}</div>;
}
