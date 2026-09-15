import axios from "axios";

const http = axios.create({
	baseURL: "http://localhost:3001/",
	timeout: 200000,
});
//请求拦截器
http.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers["authorization"] = `Bearer ${token}`;
	}
	return config;
});

//响应拦截器
//集中处理token失效的问题
http.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		if (error.response?.status === 403) {
			//删token和user缓存
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			if (window.location.pathname !== "/auth") {
				window.location.href = "/auth";
			}
		}
		return Promise.reject(error);
	}
);
export default http;
