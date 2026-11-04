export const DEFAULT_GRID_SIZE = 15;
export const DEFAULT_SNAP_SIZE = 5;
//为了对齐组件而设置工具函数 hooK,api,untils的区别
// 得到1正常格子的边长
export function nomalSize(gridSize: number): number {
	if (Number.isFinite(gridSize) && gridSize >= 5) {
		return gridSize;
	}
	return DEFAULT_GRID_SIZE;
}
export function snapToGrid(originPosition: number, gridSize: number) {
	// 得到1正常格子的边长
	const step = nomalSize(gridSize);
	//得到额外
	const extra = originPosition % step;
	//前一个格子的位置
	const lower = originPosition - extra;
	//距离前后格子的距离
	const lowerdistance = Math.abs(extra);
	const upperdistance = Math.abs(step - extra);
	// 最终吸附的线是前一个还是后一个
	const snapPosition = lowerdistance <= upperdistance ? lower : lower + step;
	//看看能不能吸附，距离左右2边<=5px才开始吸附，剩下就随便摆放了
	const isSnap = Math.min(lowerdistance, upperdistance) <= 5 ? true : false;
	return {
		originPosition: isSnap ? snapPosition : originPosition,
		isSnap,
		step,
	};
}
