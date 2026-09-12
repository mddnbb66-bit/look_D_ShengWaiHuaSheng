import express from "express";

const router = express.Router();

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
		return res.status(200).json({
			code: 0,
			message: "登录成功",
			data: {
				token: "fake-token",
				user: { email },
			},
		});
	} else {
		return res.status(401).json({ code: 40101, message: "邮箱或密码错误" });
	}
});

export default router;
