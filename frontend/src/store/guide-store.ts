import { immer } from "zustand/middleware/immer";
import { create } from "zustand";

// activeSnaps     // 当前需要显示的参考线数组
// // setActiveSnaps  // 更新这份数组的方法
// setActiveSnaps([
// 	{ xOy: "x", value: 120 },
// 	{ xOy: "y", value: 90 },
// ]);
// 的意思是	在画布横坐标120处画一条竖线	在画布纵坐标90处画一条横线
type XpisOrYpis = "x" | "y";
interface GuideState {
	activeSnaps: { xOy: XpisOrYpis; value: number }[]; // 即时吸附到的网格线位置
	setActiveSnaps: (snaps: { xOy: XpisOrYpis; value: number }[]) => void; // 设置当前吸附位置（高亮用）
}

export const useGuideStore = create<GuideState>()(
	immer((set) => ({
		activeSnaps: [],
		setActiveSnaps: (snaps) => {
			set((state) => {
				state.activeSnaps = snaps;
			});
		},
	}))
);
