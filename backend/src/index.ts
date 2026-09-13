//加载.env的
import "dotenv/config";
import app from "./app.js";
//加载env文件变量

app.listen(3001, () => {
	console.log("服务器运行，");
});
