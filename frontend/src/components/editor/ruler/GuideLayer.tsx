//辅助线层
import { useGuideStore } from "@/store/guide-store";
interface Line {
	xOy: "x" | "y"; // x：横坐标，竖轴,y：竖坐标，横轴
	value: number; // 画布坐标
}
interface GuideLayerProps {
	width: number; // 画布缩放后宽度
	height: number; // 画布缩放高度
	scale: number;
}
export function GuideLayer({ height, width, scale }: GuideLayerProps) {
	const activeSnaps = useGuideStore((state) => state.activeSnaps);
	// 1. 生成所有线的位置（跟标尺的 ticks 一样）
	if (activeSnaps.length === 0) return null;
	return (
		//参考线外框，覆盖整张画布
		<div
			className=" absolute pointer-events-none"
			style={{ left: 0, top: 0, width: width, height }}
		>
			{activeSnaps.map((line: Line, index) => {
				const isX = line.xOy === "x";
				const pos = line.value * scale;
				return (
					<div
						key={index}
						className=" absolute bg-blue-500"
						style={
							isX
								? { left: pos, top: 0, height: "100%", width: 2 }
								: { top: pos, left: 0, height: 2, width: "100%" }
						}
					></div>
				);
			})}
		</div>
	);
}
//  <div className="relative" /* 缩放占位层：960×540 */>

//    <div id="canvas" /* 原画布1920×1080，通过scale显示成960×540 */>
//    	<Renderer schema={schema} />
//    </div>

//    {/* A：参考线外框，覆盖整张画布 */}
//    <div
//    	className="absolute top-0 left-0"
//    	style={{ width: 960, height: 540 }}
//    >
//    	{/* B：竖线，在外框里面移动 */}
//    	<div
//    		className="absolute"
//    		style={{ left: 60, top: 0, width: 2, height: "100%" }}
//    	/>

//   	{/* C：横线，在外框里面移动 */}
//   	<div
//   		className="absolute"
//   		style={{ top: 45, left: 0, height: 2, width: "100%" }}
//   	/>
//   </div>
// </div> */}
