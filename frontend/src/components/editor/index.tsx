// 编辑器页：读取 URL 的 ID → 请求这个项目的详情
import { useZoom } from "@/hook/useZoom";
import { use, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getPageById, savePage } from "../../api/page";
import { Button } from "antd";
import type { PageDSL } from "@/core/schema/page";
import { useSchemaStore } from "@/store/schema-store";
import { useShallow } from "zustand/shallow";
//清洗数据的函数
const toNumber = (value: number | string | undefined, defaultNum: number) => {
	if (typeof value === "number") return value;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : defaultNum;
};

export default function EditorIndex() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>(); //从url解构出项目传入的项目id

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [refreshFlag, setRefreshFlag] = useState(0); //重试按钮用的，人为制造一个变化。refreshFlag 就是这个「变化源」：
	const [name, setName] = useState(""); //测试更不更新后面删除
	const viewportRef = useRef<null | HTMLDivElement>(null); //获取外层工作区的DOM
	const canvasRef = useRef<HTMLDivElement | null>(null); // 内层画布
	const [scroll, setScroll] = useState({ left: 0, top: 0 });
	const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null); //就是把 Schema 里的画布宽高整理出来，供 useZoom 计算缩放
	const { schema, setSchema } = useSchemaStore(
		//schema 是描述这个页面的数据对象，不是那块界面本身
		useShallow((state) => ({ schema: state.schema, setSchema: state.setSchema }))
	);

	const { autoFit, overViewScale, manualScale, scale, scaledWidth, scaledHeight } = useZoom({
		canvasSize,
		viewportRef,
	});

	useEffect(() => {
		let cancelled = false; //这能避免离开编辑器或 ID 改变后，旧请求结果覆盖当前状态
		const getPageDetail = async () => {
			if (!id) return;
			try {
				setLoading(true);
				setError(""); //每次发新请求前先把上一次的错误清掉，否则旧错误会一直留在屏幕上
				setSchema(null); //清除旧页面数据
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
	}, [id, refreshFlag, setSchema]);
	//Schema 变化 → 读取宽高 → 和旧尺寸比较 → 不同才更新画布尺寸。
	//注意：它只负责同步尺寸
	useEffect(() => {
		if (!schema) {
			setCanvasSize(null);
			return;
		}
		const width = toNumber(schema.settings?.width, 1920);
		const height = toNumber(schema.settings?.height, 1080);
		setCanvasSize((prev) => {
			// 里的 prev 是上一次的 canvasSize
			if (prev && prev.width === width && prev.height === height) return prev;
			return { width, height };
		});
	}, [schema]);
	//保存
	async function handleSave() {
		if (!id || !schema) return;
		//修改的载荷？
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
	//获取工作区滚动的信息
	function handleScroll() {
		let node = viewportRef.current; //获取目标元素
		if (!node) return; //m
		setScroll({ left: node.scrollLeft, top: node.scrollTop });
	}
	//计算总览
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
			<label>
				页面名称：
				<input
					disabled={loading}
					type="text"
					value={schema?.name ?? "加载中"}
					onChange={(event) => {
						if (!schema) return;
						setSchema({
							...schema,
							name: event.target.value,
						});
					}}
				/>
			</label>
			{loading ? <p>页面数据加载中</p> : <pre>{JSON.stringify(schema, null, 2)}</pre>}
			<Button htmlType="button" onClick={handleSave} disabled={loading}>
				保存
			</Button>
			{schema && !loading && (
				<div className="relative">
					{/* 缩放栏 */}
					<div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-xs">
						<div className=" flex items-center gap-3 text-slate-500">
							<span>画布:</span>
							<span>
								{schema.settings.height} x {schema.settings.width}
							</span>
							<span>{scale}</span>
						</div>
						<div className="flex items-center justify-between">
							<button>[]</button>
							<button>-</button>
							<button>+</button>
							<button>重置</button>
						</div>
					</div>
					{/* 下面是灰色工作区 和标尺*/}
					<div className="relative">
						<div className="absolute left-24 top-0 z-20 bg-white ">横向标尺</div>
						<div className="absolute left- 0 top-24 z-20 bg-white">竖向标尺</div>
						{/* 下面是灰色工作区 */}
						<div
							ref={viewportRef}
							id="viewport"
							className=" w-[900px] h-[500px] max-w-full overflow-auto bg-slate-100/80"
							style={{
								backgroundImage:
									"radial-gradient(circle, #e2e8f0 0.5px, transparent 0.5px)",
								backgroundSize: "16px 16px",
							}}
							//获取滚动的信息 元素滚动的时候触发
							onScroll={handleScroll}
						>
							{/* //下面是缩放占位层 */}
							<div
								className="relative"
								style={{
									width: scaledWidth,
									height: scaledHeight,
									minWidth: 320, //保证视觉上有最小尺寸，不塌陷
									minHeight: 180,
								}}
							>
								{/* //下面是渲染层 */}
								<div
									ref={canvasRef}
									id="canvas"
									style={{
										width: schema.settings.width,
										height: schema.settings.height,
										backgroundColor: schema.settings.backgroundColor || "red",
										transform: `scale(${scale})`,
										position: "absolute",
										transformOrigin: "top left",
										top: 0,
										left: 0,
									}}
								>
									这是大布
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
