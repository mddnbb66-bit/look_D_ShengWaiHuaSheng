import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
//jwt
const JWT_SECRET = process.env.JWT_SECRET || "develpemnt-secret";
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
		console.log(token);
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
