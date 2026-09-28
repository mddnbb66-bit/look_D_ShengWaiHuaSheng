export interface PageDSL {
	id: string; //它是页面根节点（RootContainer）在组件树里的唯一标识
	name: string; //页面名称
	type: "RootContainer"; //
	//页面基础信息描述
	props: {
		title: string;
		description: string;
	};
	//白布设置
	settings: {
		width: number | string; // 大屏设计稿宽度 (如 1920)
		height: number | string; // 大屏设计稿高度 (如 1080)
		backgroundColor?: string; // 背景颜色
		backgroundImage?: string; // 背景图片
		gridSize?: number; // 编辑时的吸附网格大小
	};
	// 组件树 (核心)
	// 这里的 children 就是第一层级的组件
	children?: [];
}
