import http from "./request.js";
// 前端 发给 后端 后端req.body接受

export interface SavePagePayload {
	pageId?: string;
	schema: Record<string, any>;
	meta?: {
		title?: string;
		description?: string;
	};
}
//保存页面的响应  支持更新和创建
// 后端返回的详情对象格式 	后端 还给 前端
export interface SavePageResponse {
	code: number;
	message: string;
	data: {
		pageId: string;
		name: string;
		title: string;
		description: string;
		schema: Record<string, any>;
		thumbnailUrl?: string;
		createdAt?: string;
		updatedAt?: string;
	};
}
//读取项目列表的响应的接口
export interface ListPagesResponse {
	code: number;
	message: string;

	data: PageSummary[];
}
//一个页面卡片的格式，此外，PageSummary[]才是一个数组类型
export interface PageSummary {
	pageId: string;
	name: string;
	title: string;
	description: string;
	thumbnailUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

export function savePage(payload: SavePagePayload): Promise<SavePageResponse> {
	console.log("执行了创建项目");
	return http.post("/api/pages/save", payload);
}
// /api/pages
export function listPages(): Promise<ListPagesResponse> {
	console.log("执行了读取项目");
	return http.get("/api/pages");
}
export function getPageById(id: string): Promise<SavePageResponse> {
	console.log("读取指定项目。读新建/读老的,走这个函数？");
	return http.get(`/api/pages/${id}`);
}
