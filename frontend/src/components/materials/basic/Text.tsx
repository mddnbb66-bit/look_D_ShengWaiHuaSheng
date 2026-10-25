import { TextComponentType } from "@/core/schema/ownType";
// 这个对象必须有一个 node 属性
const alignMap = { 左: "left", 居中: "center", 右: "right" } as const;
export default function TextComponent({ node }: { node: TextComponentType }) {
	const { fontSize, fontWeight, color, content, textAlign } = node.props;
	return (
		<div style={{ fontSize, fontWeight, color, textAlign: alignMap[textAlign] }}>{content}</div>
	);
}
// 属性名是固定的，还是由变量决定的
