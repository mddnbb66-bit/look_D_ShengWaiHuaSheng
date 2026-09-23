import http from "./request.js";

export interface SavePagePayload {
	schema: Record<string, any>;
	meta?: {
		title?: string;
		description?: string;
	};
}
//保存页面的响应
// 后端返回的对象格式
export interface SavePageResponse {
	code: number;
	message: string;
	data: {
		pageId: string;
		name: string;
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
