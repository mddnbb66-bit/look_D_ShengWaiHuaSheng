export default function verifyToken(req, res, next) {
	let token = null;
	const authorization = req.headers.authorization;
	//是否以bearer开头
	if (authorization?.startsWith("Bearer ")) {
		token = authorization.slice(7);
		req.token = token;
	}
	// 没有token? 返回错误信息
	if (!token) {
		res.status(403).json({
			code: 40101,
			message: "没有token",
		});
		return;
	}
	next();
}
//  else {
// 		res.status(401).json({
// 			code: "????",
// 			message: "开头不对",
// 		});
// 	}
