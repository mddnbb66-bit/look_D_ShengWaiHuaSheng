import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import bcrypt from "bcryptjs";
const router = express.Router();
//jwt
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "20s";
function signToken(user) {
	return jwt.sign(
		{ uid: user._id, email: user.email }, //载荷
		JWT_SECRET, //密钥
		{ expiresIn: JWT_EXPIRES_IN }
	); //过期时间
}
//登录逻辑
router.post("/login", (req, res) => {
	// 读取 authorization 请求头
	const authorization = req.headers.authorization;
	if (authorization?.startsWith("Bearer ")) {
		const token = authorization.slice(7);
	}
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ code: 40001, message: "邮箱或密码错误" });
	}
	if (email === "mddnbb66@gmail.com" && password === "a") {
		const token = signToken(user);
		return res.status(200).json({
			code: 0,
			message: "登录成功",
			data: {
				token: token,
				user: { email },
			},
		});
	} else {
		return res.status(401).json({ code: 40101, message: "邮箱或密码错误" });
	}
});
//注册逻辑
router.post("/register", async (req, res) => {
	const { email, password } = req.body || {}; //{}解构不会爆错
	if (!email || !password) {
		return res.status(400).json({ code: 40001, message: "邮箱和密码不能为空" });
	}
	try {
		const foundUser = await User.findOne({ email }); //查找是否有重复邮箱  //根据邮箱查询
		if (foundUser) {
			return res.status(409).json({ code: 40901, message: "邮箱已注册" });
		}
		//开始注册吧
		//把前端的密码拿过来变成hash
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ email, passwordHash });
		return res.status(200).json({ code: 0, message: "注册成功", data: user.toSafeJSON() });
	} catch (error) {
		return res.status(500).json({ code: 50000, message: "注册失败" });
	}
});
//测试jwt相关路由
const user = { _id: "mdd", email: "mddnbb66@gmail.com" };
router.get("/testjwt", (req, res) => {
	const token = signToken(user);
	console.log(token);
	res.json({
		message: "JWT 生成成功",
		token,
	});
});
export default router;
