import type { BaseComponentNodeType } from "./commonType";
//对齐方式
type justfiy = "左" | "居中" | "右";
type Trend = "上升" | "下降" | "持平";
/**
 * 文字组件
 */
export interface TextComponentType extends BaseComponentNodeType {
	type: "Text";
	props: {
		content: string;
		fontSize: number;
		fontWeight: number; //粗细
		color: string;
		textAlign: justfiy; //横向对齐的方式
	};
}
// {
//   id: "text-1",        // 是哪个节点
//   type: "Text",       // 是哪种组件
//   style: {            // 在画布哪里、占多大地方
//     left: 100,
//     top: 80,
//     width: 200,
//     height: 40,
//     zIndex: 1
//   },
//   props: {            // 文字显示什么、怎么显示
//     content: "销售大屏",
//     fontSize: 24,
//     fontWeight: 700,
//     color: "#000000",
//     textAlign: "左"
//   }
// }

// 所有可能的组件类型集合
// 定义一个类型，名字叫 ComponentNodeType。符合它的数据，可以是文字节点，或者图片节点，或者按钮节点。

export type ComponentNodeType = TextComponentType;
