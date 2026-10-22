//辅助线层

interface Line {
	xOry: "x" | "y"; // x：竖线；y：横线
	value: number; // 画布坐标
}
interface GuideLayerProps {
	width: number; // 画布宽度
	height: number; // 画布高度
	scale: number;
	gap?: number;
}
export function GuideLayer({ height, width, gap = 100, scale }: GuideLayerProps) {
	// 1. 生成所有线的位置（跟标尺的 ticks 一样）
	const lines: Line[] = [];
	for (let v = 0; v <= width; v += gap) lines.push({ xOry: "x", value: v }); // 竖线
	for (let v = 0; v <= height; v += gap) lines.push({ xOry: "y", value: v }); // 横线
	return (
		<div className="relative" style={{ height: height, width: width }}>
			{lines.map((line, ind) => {
				const isX = line.xOry === "x";
				const pos = line.value * scale;
				return (
					<div
						key={ind}
						className="absolute bg-[#f5f5f5]"
						style={
							isX
								? { left: pos, top: 0, width: 1, height: "100%" } //横线
								: { top: pos, left: 0, width: "100%", height: 1 } //竖线
						}
					></div>
				);
			})}
		</div>
	);
}
