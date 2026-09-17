//加载.env的
import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";
//mongoDB的URI
const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
	try {
		if (!MONGODB_URI) {
			throw new Error("缺少 MONGODB_URI 配置");
		}
		await mongoose.connect(MONGODB_URI);
		console.log("mongodb链接成功");
		app.listen(3001, () => {
			console.log("服务器运行，");
		});
	} catch (error) {
		console.error("数据库或者后端出问题了", error);
		process.exit(1); //退出后端
	}
}
main();
