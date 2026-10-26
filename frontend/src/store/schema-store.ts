import { create } from "zustand";
import { nanoid } from "nanoid";
import type { PageDSL } from "@/core/schema/page";
import { Component } from "react";
import { immer } from "zustand/middleware/immer";
//默认草稿
// 创建一份全新的默认 Schema，避免复用旧草稿
const createDefaultSchema = (): PageDSL => ({
	id: nanoid(),
	name: "",
	type: "RootContainer",
	props: {
		title: "",
		description: "",
	},
	settings: {
		width: 1920,
		height: 1080,
		gridSize: 15, // 默认吸附网格尺寸
	},
	children: [],
});
//dsl树
type ComponentNode = { val: 1; next: 11 };
interface SchemaState {
	// 页面组件树
	schema: PageDSL | null;
	// 当前选中的组件 id（用于属性面板、图层面板等联动）
	selectedId: string | null;
	// 当前选中的组件节点配置
	selectedNode: ComponentNode | null;
	// 更新页面级配置（名称、描述、画布尺寸等）
	updatePage: (patch: Partial<PageDSL>) => void;
	// 初始化页面组件树
	setSchema: (schema?: PageDSL | null) => void;
	// 更新当前选中的组件 id
	setSelectedId: (id: string | null) => void;
	// 查找节点
	findItem: (
		id: string,
		componentNode: ComponentNode | PageDSL
	) => ComponentNode | PageDSL | null;
	// 新增节点
	addItem: (parentId: string, newNode: ComponentNode) => boolean;
	// 删除节点
	removeItem: (id: string) => boolean;
	// 更新节点
	//partial是个啥类型？
	updateItem: (id: string, updates: Partial<ComponentNode>) => boolean;
}

/**
 * 页面 schema 的全局 store
 * - 负责初始化页面 DSL
 * - 提供对组件树的查找 / 新增 / 删除 / 更新方法
 */
export const useSchemaStore = create<SchemaState>()(
	immer((set, get) => ({
		// 页面组件树
		schema: null,
		// 当前选中的组件 id，初始为空
		selectedId: null,
		// 当前选中的组件节点配置
		selectedNode: null,
		/**
		 * 更新页面级配置，保持组件树不变
		 * @param patch 需要更新的字段集合
		 */
		updatePage: () => {},

		/**
		 * 初始化页面组件树，可传入Schema或不传
		 * @param schema 页面组件树
		 * @returns
		 */
		setSchema: (schema?: PageDSL | null) => {
			set((state) => {
				// 下面这句话是在决定：最终要放进 store 的 schema 是什么。
				// null      = 没有页面									loading = true   // 正在加载
				// undefined = 没传，创建默认页面    类似于 			 schema = null    // 当前没有页面数据
				// 对象      = 使用真实页面								schema = object  // 页面加载完成
				const resolvedSchema = schema === null ? null : (schema ?? createDefaultSchema());
				state.schema = resolvedSchema;
				state.selectedId = null;
				state.selectedNode = null;
				//有来自后端的数据时候
				if (state.schema) {
					// 这段代码可以补齐旧项目中缺少的 settings 字段：
					const currentSettings = state.schema.settings ?? {};
					state.schema.settings = {
						...currentSettings,
						width: currentSettings.width ?? 1920,
						height: currentSettings.height ?? 1080,
						// backgroundColor: currentSettings.backgroundColor ?? "black",
					};
				}
			});
		},
		setSelectedId: () => {},
		findItem: () => {
			return null;
		},
		addItem: () => {
			return true;
		},
		removeItem: () => {
			return true;
		},
		updateItem: () => {
			return true;
		},
	}))
);
// 不使用中间件
// create<SchemaState>((set) => ({
//     // ...
// }));

// 使用 immer 等中间件
// create<SchemaState>()(
//     immer((set) => ({
//         // ...
//     }))
// );
