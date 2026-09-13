import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
	const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
	let token = null;
	const authorization = req.headers.authorization;
	//是否以bearer开头
	if (authorization?.startsWith("Bearer ")) {
		token = authorization.slice(7);
		req.token = token;
	}
	// 没有token? 返回错误信息
	if (!token) {
		res.status(401).json({
			code: 40101,
			message: "没有token",
		});
		return;
	}
	//验证token是否合法
	try {
		req.user = jwt.verify(token, JWT_SECRET);
		next();
	} catch (error) {
		res.status(403).json({
			code: 40101,
			message: "token不合法",
		});
	}
}
//  else {
// 		res.status(401).json({
// 			code: "????",
// 			message: "开头不对",
// 		});
// 	}
