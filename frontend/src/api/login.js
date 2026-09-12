import http from "./request";
function login(email, password) {
	console.log("执行了");
	return http.post("/login", { email, password });
}
export { login };
