import { create } from "zustand";
import { nanoid } from "nanoid";
import type { PageDSL } from "@/core/schema/page";
import { Component } from "react";
import { immer } from "zustand/middleware/immer";
import { ComponentNodeType } from "@/core/schema/ownType";
import { findNodeById, updateNodeById, removeNodeById, addNodeToParent } from "@/hook/CRUDtree";
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
interface SchemaState {
	// 页面组件树
	schema: PageDSL | null;
	// 当前选中的组件 id（用于属性面板、图层面板等联动）
	selectedId: string | null;
	// 当前选中的组件节点配置
	selectedNode: ComponentNodeType | null;
	// 更新页面级配置（名称、描述、画布尺寸等）
	updatePage: (patch: Partial<PageDSL>) => void;
	// 初始化页面组件树
	setSchema: (schema?: PageDSL | null) => void;
	// 更新当前选中的组件 id
	setSelectedId: (id: string | null) => void;
	// 查找节点
	findNode: (
		id: string,
		omponentNodeType: ComponentNodeType | PageDSL
	) => ComponentNodeType | PageDSL | null;
	// 新增节点
	addNode: (parentId: string, newNode: ComponentNodeType) => boolean;
	// 删除节点
	removeNode: (id: string) => boolean;
	// 更新节点
	//partial是个啥类型？
	updateNode: (id: string, updates: Partial<ComponentNodeType>) => boolean;
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
		//点击选中，传入id,靠findNodeById这个返回节点所有数据
		// 然后更新当前选中的组件 id，并同步选中节点配置
		setSelectedId: (id: string | null) => {
			set((state) => {
				state.selectedId = id;
				if (id && state.schema) {
					// 只有 id 存在，并且页面 schema 已加载时，才继续查找节点
					const node = findNodeById(id, state.schema);
					state.selectedNode =
						node && node.id !== state.schema.id ? (node as ComponentNodeType) : null;
				} else {
					state.selectedNode = null;
				}
			});
		},
		/**
		 * 根据id查找组件树中的某个组件
		 * @param id 组件id
		 * @param componentNode 组件树节点
		 * @returns
		 */
		//点击组件，返回全部数据，包括整个schema
		findNode: (id: string, componentNode: PageDSL | ComponentNodeType) => {
			return findNodeById(id, componentNode);
		},
		/**
		 * 根据父亲id和组件给组件树中的某个组件
		 * @param id 组件id
		 * @param componentNode 组件树节点
		 * @returns
		 */
		addNode: (parentId: string, newNode: ComponentNodeType) => {
			const { schema } = get(); //旧快照
			if (!schema) return false;
			let isSuccess = false;
			set((state) => {
				if (!state.schema) return;
				isSuccess = addNodeToParent(parentId, state.schema, newNode);
			});
			return isSuccess;
		},
		/**
		 * 删除指定ID的节点
		 * @param id 要删除的节点id
		 * @returns 是否删除成功
		 */
		removeNode: (id: string) => {
			const { schema } = get();
			if (!schema) return false;
			let isSuccess = false;
			// 不能删除根节点
			if (id === schema.id) return false;
			set((state) => {
				if (!state.schema) return;
				//删除节点
				isSuccess = removeNodeById(id, state.schema);
				// 如果删除的是当前选中节点，清空选中状态
				if (isSuccess && state.selectedId === id) {
					state.selectedId = null;
					state.selectedNode = null;
				}
			});

			return isSuccess;
		},

		updateNode: (id: string, updates: Partial<ComponentNodeType>): boolean => {
			const { schema } = get();
			if (!schema) return false;
			let isSuccess = false;
			set((state) => {
				if (!state.schema) return;
				//更新节点
				isSuccess = updateNodeById(id, state.schema, updates);
				if (isSuccess && state.selectedId === id) {
					const node = findNodeById(id, state.schema);
					state.selectedNode = node ? (node as ComponentNodeType) : null;
				}
			});
			return isSuccess;
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
