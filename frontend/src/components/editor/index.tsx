// 编辑器页：读取 URL 的 ID → 请求这个项目的详情

import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getPageById, savePage } from "../../api/page";
import { Button } from "antd";
export default function EditorIndex() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>(); //从url解构出项目传入的项目id
	const [schema, setSchema] = useState<Record<string, any> | null>(null); //schema 是描述这个页面的数据对象，不是那块界面本身
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [refreshFlag, setRefreshFlag] = useState(0); //重试按钮用的，人为制造一个变化。refreshFlag 就是这个「变化源」：
	useEffect(() => {
		let cancelled = false; //这能避免离开编辑器或 ID 改变后，旧请求结果覆盖当前状态
		const getPageDetail = async () => {
			if (!id) return;
			try {
				setLoading(true);
				setError(""); //每次发新请求前先把上一次的错误清掉，否则旧错误会一直留在屏幕上
				const page = await getPageById(id);
				if (cancelled) return;
				if (page.code !== 0) {
					throw new Error("获取页面详情数据失败");
				}
				if (page.code === 0) {
					setSchema(page.data.schema);
				}
				console.log(page);
			} catch (err: any) {
				if (cancelled) return;
				setError(err.response?.data?.message || err.message || "读取项目失败");
			} finally {
				if (!cancelled) setLoading(false); //如果本轮 Effect 尚未清理，就结束等待，无论请求成功还是失败。
			}
		};
		getPageDetail();
		return () => {
			cancelled = true;
		};
	}, [id, refreshFlag]);
	//保存
	async function handleSave() {
		if (!id || !schema) return;
		const payload = {
			pageId: id,
			schema: schema,
			meta: {},
		};
		try {
			const res = await savePage(payload);
			const code = res.code;
			if (code === 0) {
				console.log("保存成功");
				navigate(`/projects`);
			}
		} catch (error) {
			console.log(error);
		}
	}
	if (error) {
		//他人带这同id放访问就会出现这样的页面
		return (
			<div className="flex h-screen items-center justify-center bg-slate-50">
				<div className="vc-card p-8 max-w-sm text-center space-y-4 animate-fade-in">
					<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="12" cy="12" r="10" />
							<line x1="15" y1="9" x2="9" y2="15" />
							<line x1="9" y1="9" x2="15" y2="15" />
						</svg>
					</div>
					<div className="text-base font-semibold text-slate-800">页面加载失败</div>
					<div className="text-sm text-slate-500">{error}</div>
					<div className="flex justify-center gap-3">
						<button
							className="vc-btn text-sm "
							onClick={() => setRefreshFlag((v) => v + 1)}
						>
							重试
						</button>
						<button
							className="vc-btn-ghost text-sm"
							onClick={() => navigate("/projects")}
						>
							返回项目列表
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<p>这是主编辑页</p>
			<hr />
			<p>这个项目的id:{id}</p>
			{loading ? <p>页面数据加载中</p> : <pre>{JSON.stringify(schema, null, 2)}</pre>}
			<Button htmlType="button" onClick={handleSave}>
				保存
			</Button>
		</>
	);
}
