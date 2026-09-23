import http from "../../api/request";
import { Button } from "antd";
import { savePage, listPages, type PageSummary } from "../../api/page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function ProjectList() {
	//data
	const [projects, setProjects] = useState<PageSummary[]>([]); //这个是读取的项目卡片列表
	const [loading, setLoading] = useState(true); //展现加载状态
	const [error, setError] = useState(""); //读取错误的状态

	const navigate = useNavigate();

	//method
	async function checkToken() {
		//通过http发送请求 这样就携带头
		try {
			const result = await http.get("/api/pages");
			console.log(result);
		} catch (error: any) {
			console.log(error.response?.data);
		}
	}
	//创建项目
	const handleCreate = async () => {
		let payload = {
			schema: {
				name: "我的第一个项目",
				props: {},
				children: [],
			},
		};
		try {
			const res = await savePage(payload);
			const code = res.code;
			if (code === 0) {
				console.log("创建成功，进入项目页");
				navigate(`/editor/${res.data.pageId}`);
			}
			//创建成功后再读取一下 这样可以刷新
		} catch (error) {
			console.log("创建出错误");
		}
	};
	//读取项目的测试
	useEffect(() => {
		let cancelled = false;
		//cancelled === false // 本轮 Effect 尚未被清理，可以使用结果
		//cancelled === true  // 本轮 Effect 已被清理，不再使用结果
		const fetchProjects = async () => {
			try {
				setLoading(true);
				setError("");
				const result = await listPages();
				//这个是为了上一次请求才来，设置的取消
				if (cancelled) return;
				if (result.code === 0) {
					console.log("读取成功");
					console.log(result.data);
					setProjects(result.data);
				} else {
					//业务码不对
					throw new Error(result.message || "获取项目失败");
				}
			} catch (err: any) {
				//读取爆错的走的
				if (cancelled) return;
				setError(err.response?.data?.message || err.message || "读取项目失败");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		fetchProjects(); //为啥要单独套一层，因为effect不能加async
		return () => {
			cancelled = true;
		};
	}, []);
	return (
		<>
			<h1>项目页</h1>
			<button type="button" onClick={checkToken}>
				{"检查token是否传递3001/api/pages"}
			</button>
			<h2>项目列表</h2>
			<Button htmlType="button" onClick={handleCreate}>
				创建项目
			</Button>
			<hr />
			{/* <Button htmlType="button" onClick={handleRead}>
				读取项目
			</Button> */}
			{error && (
				<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
					{error}
				</div>
			)}

			{!loading && !error && <p>项目数量：{projects.length}</p>}
			<ul>
				{loading ? (
					<li>加载中</li>
				) : (
					projects.map((item) => {
						return <li key={item.pageId}>{item.name}</li>;
					})
				)}
			</ul>
		</>
	);
}
export default ProjectList;

//创建项目的res
// 后端 res.json({ code, message, data })
//         ↓
// Axios 原始 response = {
//   status: 200,
//   statusText: "OK",
//   headers: {...},
//   config: {...},
//   request: {...},
//   data: { code: 0, message: "获取项目列表成功", data: [...] }   ← HTTP 响应体
// }
//         ↓
// 你的拦截器 return response.data
//         ↓
// 前端拿到的 result = { code: 0, message: "获取项目列表成功", data: [...] }
//每一个item长这样
//   {
//     pageId: '6ab2242bd29851b3b360a34b',
//     name: '我的第一个项目',
//     title: '',
//     description: '',
//     thumbnailUrl: '',
//     createdAt: "2026-09-22T06:46:03.111Z"
//     updatedAt: "2026-09-22T06:46:03.111Z"
//   }
