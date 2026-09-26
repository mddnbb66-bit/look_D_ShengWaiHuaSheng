//封装响应
import { type Response } from "express";

export const RespCode = {
	SUCCESS: 0,
	VALIDATION: 40001, //效验问题
	UNAUTHORIZED: 40101, //token问题/账密验证
	NOT_FOUND: 40401, // 新增：资源不存在
	CONFLICT: 40901, //与现有资源状态冲突
	SERVER_ERROR: 50000, //服务端异常
} as const;

export type RespCodeValue = (typeof RespCode)[keyof typeof RespCode];

export function ok(
	res: Response,
	code: RespCodeValue = RespCode.SUCCESS,
	message = "ok",
	data: unknown = null
) {
	return res.json({ code, message, data });
}
export function fail(
	res: Response,
	code: RespCodeValue = RespCode.SERVER_ERROR,
	message = "error",
	httpStatus = 500
) {
	return res.status(httpStatus).json({ code, message });
}
