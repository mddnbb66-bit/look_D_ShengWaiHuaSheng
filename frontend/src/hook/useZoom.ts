import { useEffect, useMemo, useRef, useState } from "react";

/**
 * 缩放 Hook 入参
 * - canvasSize: 画布原始尺寸（宽高），用于计算缩放后尺寸
 * - viewportRef: 承载画布的可滚动容器 ref，基于其 clientWidth/clientHeight 计算自适应比例
 * - resetOnCanvasSizeChange: 画布宽高变更时是否重置为自适应（默认 true）
 * - minScale/maxScale: 自适应比例上下限，避免过小/过大导致不可用
 */
interface ZoomOptions {
	canvasSize: { width: number; height: number } | null; // 设计画布原始尺寸，如 1920×1080
	viewportRef: React.RefObject<HTMLElement | null>; // 可滚动容器的 ref，用来量"屏幕"多大	「一个装着 HTML 元素的 ref 对象」
	resetOnCanvasSizeChange?: boolean; // 画布尺寸变了要不要重置回自适应，默认 true
	minScale?: number; // 缩放下限，默认 0.1
	maxScale?: number; // 缩放上限，默认 1.5
	canvasRef?: React.RefObject<HTMLElement | null>; // 编辑器传入真实画布，用来换算观察中心
	viewKey?: string; // 项目身份变化后，不允许返回上一个项目的观察位置
}
//限制缩放比例
const clamp = (value: number, min: number, max: number) => {
	if (value < min) return min;
	if (value > max) return max;
	return value;
};
export const useZoom = ({
	canvasSize,
	viewportRef,
	resetOnCanvasSizeChange = true,
	minScale = 0.1,
	maxScale = 1.5,
}: ZoomOptions) => {
	const [autoFit, setAutoFit] = useState(true); //为true代表总览倍数 自适应模式开关
	const [manualScale, setManualScale] = useState(1); //人工调整
	const [overViewScale, setOverViewScale] = useState(1); //总览倍率
	// “容器大小变化时计算自适应（总览）比例
	useEffect(() => {
		//先保存元素在判断非空
		if (!canvasSize || !viewportRef.current) return;
		//计算总览的函数
		const computeOverViewScale = () => {
			const scale = Math.min(
				viewportRef.current!.clientHeight / canvasSize.height,
				viewportRef.current!.clientWidth / canvasSize.width
			);
			setOverViewScale(Number(clamp(scale, minScale, maxScale).toFixed(3)));
		};
		computeOverViewScale();
		//响应式处理
		// 工作区大小变化:左右面板展开、收起或调整宽度；父布局变化；工作区自身宽高改变
		// ResizeObserver：浏览器原生 API，专门监听某个 DOM 元素的尺寸变化
		const resizeObserver = new ResizeObserver(computeOverViewScale);
		resizeObserver.observe(viewportRef.current);
		// 浏览器窗口大小变化 :拖动浏览器窗口边缘、最大化或还原、停靠开发者工具挤占页面空间
		window.addEventListener("resize", computeOverViewScale);
		return () => {
			resizeObserver.disconnect(); //停止观察，否则组件没了还在监听，内存泄漏
			window.removeEventListener("resize", computeOverViewScale); //同理，而且必须传同一个函数引用才能解绑成功
		};
	}, [canvasSize, viewportRef, minScale, maxScale]);
	//缩放比例和缩放占位区的缩放宽高
	const scale = autoFit ? overViewScale : manualScale;
	const scaledWidth = canvasSize ? canvasSize.width * scale : 0;
	const scaledHeight = canvasSize ? canvasSize.height * scale : 0;

	return {
		autoFit,
		overViewScale,
		manualScale,
		scale,
		scaledWidth,
		scaledHeight,
	};
};
