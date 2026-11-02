import { ComponentNodeType } from "@/core/schema/ownType";
import { PageDSL } from "@/core/schema/page";
type TreeNode = PageDSL | ComponentNodeType;
//传进来一个node:要看看里面有没有可以遍历的孩子数组
//返回值是个bool,检查 node里面得有这个字段，并且这个字段对应一个数组，而且 这个数组得是ComponentType[]类型的
// 其中 & 表示交叉类型，可以理解为“同时满足两种类型
//下面的东西主要是满足ts
const isHasChildren = (node: TreeNode): node is TreeNode & { children: ComponentNodeType[] } => {
	return "children" in node && Array.isArray(node.children);
};

/**
 * 在指定父节点下插入子节点
 * 会在整棵树中查找 parentId 对应的节点并插入 newNode
 * @param parentId 父节点 id
 * @param root 当前整在检查的节点，第一次通常为schema 不能缺少根节点，因为schema是整个树的入口，只有id的话会不知道往哪里插入
 * @param newNode 要插入的组件节点
 * @returns 是否插入成功
 */
export const addNodeToParent = (
	parentId: string,
	root: ComponentNodeType | PageDSL,
	newNode: ComponentNodeType
): boolean => {
	if (parentId === root.id) {
		//找到位置了
		if (isHasChildren(root)) {
			root.children.push(newNode);
		} else {
			(root as any).children = [newNode];
		}
		return true;
	}
	// 找不到如果下一层就继续 每一个children 项 都递归
	if (isHasChildren(root)) {
		for (const child of root.children) {
			if (addNodeToParent(parentId, child, newNode)) {
				return true;
			}
		}
	}
	return false;
};
// 比如组件数是  要如果要把新节点添加到 container-b  so addNodeToParent("container-b", schema, newNode);
// schema
// ├── container-a
// │   ├── text-a
// │   └── image-a
// └── container-b
//     └── button-a
// 第一次发现"container-b" !==  schema.id
// 那么就
// schema
// ├── 检查 container-a
// │   ├── 检查 text-a
// │   └── 检查 image-a
// └── 检查 container-b
// 直到root.id === parentId
// container-b.children
/**
 * 在组件树中根据 id 查找节点
 * 采用深度优先遍历（DFS），一旦找到目标节点立即返回
 * @param id 要查找的节点 id
 * @param node 当前遍历到的根节点
 * @returns 找到的节点，找不到则为 null
 */
export function findNodeById(id: string, node: TreeNode | null): TreeNode | null {
	if (!node) return null;
	if (node.id === id) return node;
	// 只要节点存在 children 就继续向下查找，不再依赖 type 字段
	// 这里使用 DFS 遍历所有子节点
	if (isHasChildren(node)) {
		for (const child of node.children) {
			const found = findNodeById(id, child);
			if (found) return found;
		}
	}
	return null;
}

/**
 * 根据 id 更新树中的节点属性
 * 会对命中的节点执行浅层 Object.assign
 * @param id 要更新的节点 id
 * @param root 遍历的根节点
 * @param updates 要合并到节点上的属性
 * @returns 是否更新成功
 */
export function updateNodeById(
	id: string,
	root: TreeNode,
	updates: Partial<ComponentNodeType>
): boolean {
	if (root.id === id) {
		// 命中目标节点，直接合并属性
		Object.assign(root, updates);
		return true;
	}
	if (isHasChildren(root)) {
		// 未命中则递归子节点
		for (const child of root.children) {
			if (updateNodeById(id, child, updates)) {
				return true;
			}
		}
	}

	return false;
}
/**
 * 根据 id 从树中删除节点
 * 仅修改 children 数组，不会删除根节点自身
 * @param id 要删除的节点 id
 * @param root 遍历的根节点
 * @returns 是否删除成功
 */
export function removeNodeById(id: string, root: TreeNode): boolean {
	if (!isHasChildren(root)) return false;
	const index = root.children.findIndex((child) => child.id === id);

	if (index !== -1) {
		//走到这里说明当前层级又要删除的东西
		root.children.splice(index, 1);
		return true;
	}
	//走到这里说明当前层级没有要删除的
	for (const child of root.children) {
		if (removeNodeById(id, child)) {
			return true;
		}
	}

	return false;
}
// 	如果当前 root 的直接子节点中找到了目标：
//     删除它并返回 true
// 否则：
//     递归搜索每个子节点
//     如果递归删除成功，返回 true
//     全部失败后返回 false
