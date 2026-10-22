import http from "../../api/request";
import { Button } from "antd";
import { savePage, listPages, type PageSummary, deletePage, SavePagePayload } from "../../api/page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

function ProjectList() {
	//data
	const [projects, setProjects] = useState<PageSummary[]>([]); //这个是读取的项目卡片列表
	const [loading, setLoading] = useState(true); //展现首次加载状态
	const [error, setError] = useState(""); //读取错误的状态
	const [deletingId, setDeletingId] = useState(""); //判断删除的对应项目的加载状态
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
		let payload: SavePagePayload = {
			schema: {
				id: "111",
				type: "RootContainer",
				name: "我的第一个项目",
				props: {
					title: "第一个项目的对外标题",
					description: "第一个项目的描述咕咕嘎嘎",
				},
				settings: {
					width: 1920,
					height: 1080,
					backgroundColor: "white",
					backgroundImage: "xxxurl",
					gridSize: 111,
				},
				children: [],
			},
			thumbnail: "xxx",
			userId: "sdda",
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
				console.log(result);
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
	//获取对应的项目id 查看项目细节
	function lookProjectDetail(pageId: string) {
		navigate(`/editor/${pageId}`);
	}
	//删除函数,删除完也要读取项目列表
	async function handleDeleteProject(pageId: string, name: string) {
		setError("");
		let deleted = false;

		Modal.confirm({
			title: `确认删除项目:${name}`,
			content: "删除后无法恢复",
			okText: "删除",
			cancelText: "取消",
			async onOk() {
				setDeletingId(pageId);
				try {
					//删除
					const deleteResult = await deletePage(pageId);
					if (deleteResult.code === 0) {
						deleted = true;
						//读取
						const result = await listPages();
						if (result.code === 0) {
							console.log("读取成功");
							setProjects(result.data);
						} else {
							throw new Error(result.message || "获取项目失败");
						}
					} else {
						throw new Error(deleteResult.message || "删除项目失败");
					}
				} catch (err: any) {
					if (deleted === false) {
						setError(err.response?.data?.message || err.message || "删除错误");
					} else {
						setError(
							`项目已删除，但列表刷新失败：${err.response?.data?.message || err.message || "请稍后重试"}`
						);
					}
				} finally {
					setDeletingId("");
				}
			},
			onCancel() {
				// 用户点击“取消”后，执行这里；不需要处理可以不写
			},
		});
	}

	return (
		<>
			<h1>项目页</h1>
			<button type="button" onClick={checkToken}>
				{"检查token是否传递3001/api/pages"}
			</button>
			<h2>项目列表</h2>
			<Button htmlType="button" onClick={handleCreate}>
				{/** 创建按钮：保存新项目 → 跳转 /editor/项目ID*/}
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
						return (
							<div key={item.pageId} onClick={() => lookProjectDetail(item.pageId)}>
								{item.name}
								<Button
									onClick={(event) => {
										event?.stopPropagation();
										handleDeleteProject(item.pageId, item.name);
									}}
									disabled={deletingId === item.pageId}
								>
									删除
								</Button>
							</div>
						);
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
