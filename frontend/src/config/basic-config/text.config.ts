import { TextComponentType } from "@/core/schema/ownType";

/**
 * Text组件默认配置
 */
export const textDefaultConfig: TextComponentType = {
	type: "Text",
	id: "",
	props: {
		content: "我是默认文本，咕咕嘎嘎",
		fontSize: 16,
		fontWeight: 200,
		color: "black",
		textAlign: "左",
	},
	style: {
		top: 0, //上偏移
		left: 0, //左偏移
		width: 200,
		height: 30,
		zIndex: 1,
	},
};
