import { ComponentNodeType } from "../schema/ownType";
import { componentRegistryMap, type RegistryOkCommponent } from "@/components/materials/registry";

//兜底的未知组件
const unKnowComponent = ({ node }: any) => {
	return <div style={{ color: "red" }}>未知组件,类型是{node.type}</div>;
};

export function Renderer({ schema }: { schema: ComponentNodeType }) {
	const renderComponent = componentRegistryMap.get(schema.type) ?? unKnowComponent;
	const content = renderComponent({ node: schema }); //新建一个对象，键叫 node，值是变量 schema 里装的东西。
	return <div style={{ position: "absolute", ...schema.style }}>{content}</div>;
}
