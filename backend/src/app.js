import express from "express";
import authRouter from "./routes/auth.js";
import cors from "cors";
import verifyToken from "./middleware/verifyToken.js";
const app = express();
//配置浏览器跨域访问
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

// 网络上传输的请求体本质上类似一段 JSON 文本：
// 把这个JSON 文本转换成 JavaScript 对象
app.use(express.json());
app.get("/check-token", verifyToken, (req, res) => {
	res.send({ token: Boolean(req.token) });
});
app.get("/health", (req, res) => {
	console.log(req);
	res.send("服务正常");
});

app.use("/", authRouter);
export default app;
