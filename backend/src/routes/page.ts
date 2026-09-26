import express from "express";
import Page from "../model/Page.ts";
import { ok, fail, RespCode } from "../utils/response.ts";
import { type Request, type Response } from "express";
import mongoose from "mongoose";
import { time } from "console";
import { title } from "process";
const router = express.Router();
// {
//   method: "GET",
//   url: "/api/pages",
//   headers: {
//     authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",
//     host: "localhost:3000",
//     ...
//   },
//   body: {},
//   query: {},
//   params: {},

//   // verifyToken 中间件验证成功后才添加
//   token: "eyJhbGciOiJIUzI1NiIs...",

//   user: {
//     uid: "用户的 MongoDB _id",
//     email: "用户邮箱",
//     iat: 1758000000,
//     exp: 1758000020
//   }
// }
// req的结构
//查询项目，顺便改id
router.get("/", async (req, res) => {
	try {
		const uid = (req.user as any)?.uid;
		if (typeof uid !== "string" || !uid.trim()) {
			// !uid.trim() 检查的是：去掉首尾空白后，ID 是不是空字符串。
			return fail(res, RespCode.UNAUTHORIZED, "id缺失", 401);
		}
		// 下面是做一份查询(查谁, 取哪些字段).设置排序(怎么排)
		const pages = await Page.find(
			{ ownerid: uid },
			"pageId name title description thumbnailUrl schema createdAt updatedAt"
		).sort({ updatedAt: -1 });
		//把每一个字段取出来，其中把_id变成pageId
		const data = pages.map((page) => ({
			pageId: page._id.toString(),
			name: page.name,
			title: page.title,
			description: page.description,
			thumbnailUrl: page.thumbnailUrl,
			createdAt: page.createdAt,
			updatedAt: page.updatedAt,
		}));
		console.log(data);
		return ok(res, RespCode.SUCCESS, "获取项目列表成功", data);
	} catch (error) {
		//find() 没找到返回 [] 用uid判断
		return fail(res, RespCode.SERVER_ERROR, "获取失败", 500);
	}
});

export default router;
// 创建页面 schema：支持创建与更新
//从前端获取信息保存
router.post("/save", async (req, res) => {
	const { meta = {}, schema, pageId } = req.body || {};
	const uid = (req.user as any)?.uid;
	if (typeof uid !== "string" || !uid.trim()) {
		// !uid.trim() 检查的是：去掉首尾空白后，ID 是不是空字符串。
		return fail(res, RespCode.UNAUTHORIZED, "id缺失", 401);
	}
	if (!schema) {
		return fail(res, RespCode.VALIDATION, "请求缺少必需参数schema", 400);
	}
	//要更新的字段
	const payload = {
		schema,
		name: schema.name ?? "",
		title: meta.title ?? schema?.props?.title ?? "",
		description: meta.description ?? schema?.props?.description ?? "",
	};
	try {
		//下面是if更新，else创建逻辑
		if (pageId) {
			if (!mongoose.Types.ObjectId.isValid(pageId)) {
				return fail(res, RespCode.VALIDATION, "pageId不合法", 400);
			}
			let pageDoc = await Page.findOneAndUpdate({ _id: pageId, ownerid: uid }, payload, {
				new: true,
				upsert: false,
			});
			if (!pageDoc) {
				return fail(res, RespCode.NOT_FOUND, "找不到对应页面", 404);
			}
			return ok(res, RespCode.SUCCESS, "保存项目成功", pageDoc.toSafeJSON());
			//下面创建
		} else {
			const page = await Page.create({
				...payload,
				ownerid: uid,
			});
			return ok(res, RespCode.SUCCESS, "创建项目成功", page.toSafeJSON());
		}
	} catch (error) {
		return fail(res, RespCode.SERVER_ERROR, "创建/保存失败", 500);
	}
});
//对对应用户的对应项目进行编辑的在编辑器首页的接口，为啥要这个?因为列表返回到是摘要
router.get("/:id", async (req: Request, res: Response) => {
	const { id } = req.params || {}; //解构出前端url的项目id
	const uid = (req.user as any)?.uid;
	if (!id) {
		return fail(res, RespCode.VALIDATION, "pageId不能为空", 400);
	}
	if (typeof uid !== "string" || !uid.trim()) {
		//uid.trim()  如果是空字符串，这个可以防住
		return fail(res, RespCode.UNAUTHORIZED, "token有问题", 401);
	}
	try {
		const pageDoc = await Page.findOne({ _id: id, ownerid: uid });
		if (!pageDoc) {
			//因为这是id参数的问题
			return fail(res, RespCode.VALIDATION, "未找到对应页面", 404);
		}
		return ok(res, RespCode.SUCCESS, "查到对应id的项目", pageDoc.toSafeJSON());
	} catch (error) {
		return fail(res, RespCode.NOT_FOUND, "查找你的对应项目失败", 404);
	}
});

//查询pages长这样
// [
//   {
//     _id: new ObjectId('6ab2242bd29851b3b360a34b'),
//     name: '我的第一个项目',
//     title: '',
//     description: '',
//     thumbnailUrl: '',
//     schema: { name: '我的第一个项目', children: [] }
//   }
// ]
//data变成这样
// [
//   {
//     pageId: '6ab2242bd29851b3b360a34b',
//     name: '我的第一个项目',
//     title: '',
//     description: '',
//     thumbnailUrl: '',
//     createdAt: 2026-09-22T06:46:03.111Z,
//     updatedAt: 2026-09-22T06:46:03.111Z
//   }
// ]
