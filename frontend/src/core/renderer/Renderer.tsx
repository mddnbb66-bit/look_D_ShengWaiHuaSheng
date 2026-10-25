import { ReactNode } from "react";
import { ComponentNodeType } from "../schema/ownType";
import { componentRegistryMap, type RegistryOkCommponent } from "@/components/materials/registry";

//兜底的未知组件
const unKnowComponent = ({ node }: any) => {
	return <div style={{ color: "red" }}>未知组件,类型是{node.type}</div>;
};
// Renderer 自己收到的参数（和物料组件的 RendererProps 不是一回事）
interface SchemaRendererProps {
	schema: ComponentNodeType | ComponentNodeType[]; // 单个节点，或者一组节点
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
	const content = renderComponent({ node: schema }); //新建一个对象，键叫 node，值是变量 schema 里装的东西。
	return <div style={{ position: "absolute", ...schema.style }}>{content}</div>;
}
