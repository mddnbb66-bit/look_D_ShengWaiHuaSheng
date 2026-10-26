import { PageDSL } from "./page";
import { ComponentNodeType } from "./ownType";
// 组件类型枚举
//也就只描述组件叫什么种类
export type ComponentType =
	| "Text"
	| "Image"
	| "Button"
	| "Container"
	| "Clock"
	| "StatisticCard"
	| "ProgressBar"
	| "Countdown"
	| "Divider"
	| "Badge"
	| "Tag"
	| "Avatar"
	| "Rate"
	| "Switch"
	| "BarChart" //柱状图
	| "MultiBarChart" //多系列柱状图
	| "LineChart" //折线图
	| "PieChart" //饼图
	| "ScatterChart" //散点图
	| "BubbleChart" //气泡图
	| "AreaChart" //面积图
	| "MultiLineChart" //多折线图
	| "HorizontalBarChart" //横向柱状图
	| "RosePieChart" //玫瑰图
	| "RadarChart" //雷达图
	| "FunnelChart" //漏斗图
	| "GaugeChart" //仪表盘
	| "TreemapChart"; //矩形树图

/**
 * 基础组件节点接口
 * 所有的具体组件都继承自这个接口
 */
export interface BaseComponentNodeType {
	// 核心标识
	id: string; // UUID，组件在当前页面的唯一标识
	type: ComponentType; // 组件类型枚举，用于渲染器决定渲染哪个 React 组件
	name?: string; // 组件在图层面板显示的名称 (如: "我的柱状图")
	isHidden?: boolean; // 是否隐藏
	isLocked?: boolean; // 是否锁定（防误触）

	// 样式属性 (CSS + 布局)
	style?: {
		// 基础定位与尺寸 (大屏强依赖绝对定位)
		top: number; // 左偏移
		left: number; // 上偏移
		width: number; // 宽度
		height: number; // 高度
		zIndex: number; // 层级

		// 视觉样式
		opacity?: number; // 透明度
		backgroundColor?: string; // 背景颜色
		border?: string; // 边框样式
		borderRadius?: number; // 圆角
		// ... 其他 CSS 属性
		[key: string]: any;
	};

	// 交互事件 (可选，进阶功能)
	// events?: {
	//   onClick?: Action[]; // 点击时触发的动作（如：跳转链接、弹窗）
	// };
}
/**
 * 每个物料组件收到的参数
 */
export interface RendererProps {
	node: ComponentNodeType | PageDSL; //要么是一个节点，要么是一整个树即根节点
	mode?: "edit" | "preview";
}
