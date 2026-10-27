//处理非根节点的渲染
import { componentRegistryMap } from "@/components/materials/registry";
import type { ComponentNodeType } from "../schema/ownType";
const unKnowComponent = ({ node }: any) => {
	return <div style={{ color: "red" }}>未知组件,类型是{node.type}</div>;
};
//传进来的东西
// {
// 	node: {
// 		type: "Text",
// 		id: "1145",
// 		props: {
// 			content: "我是默认文本，咕咕嘎嘎",
// 			fontSize: 16,
// 			fontWeight: 200,
// 			color: "black",
// 			textAlign: "左"
// 		},
// 		style: {
// 			top: 100,
// 			left: 100,
// 			width: 100,
// 			height: 30,
// 			zIndex: 1
// 		}
// 	}
// }
export function NodeRenderer({ node }: { node: ComponentNodeType }) {
	//先查表，得到对应的子组件
	const NodeComponent = componentRegistryMap.get(node.type) ?? unKnowComponent;
	// 容器里的孩子也交给 NodeRenderer，形成递归
	//包一层然后渲染
	return (
		<div style={{ position: "absolute", ...node.style }}>
			<NodeComponent node={node} />
		</div>
	);
}
