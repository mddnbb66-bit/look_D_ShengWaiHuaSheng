import http from "../../api/request";

function ProjectList() {
	//method
	async function checkToken() {
		//通过http发送请求 这样就携带头
		try {
			const result = await http.get("/check-token");
			console.log(result);
		} catch (error: any) {
			console.log(error.response?.data);
		}
	}

	return (
		<>
			<h1>项目页</h1>
			<button type="button" onClick={checkToken}>
				{"检查token是否传递3001/checktoken"}
			</button>
		</>
	);
}
export default ProjectList;
