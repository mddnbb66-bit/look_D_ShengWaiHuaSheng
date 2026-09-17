import http from "./request";
export function login(email, password) {
	console.log("执行了登录");
	return http.post("/login", { email, password });
}
export function register(email, password) {
	console.log("执行了注册");
	return http.post("/register", { email, password });
}
