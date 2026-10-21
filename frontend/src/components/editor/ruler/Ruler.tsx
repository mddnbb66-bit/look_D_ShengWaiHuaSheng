interface RulerProps {
	xOry: "x" | "y"; //是x还是y?
	length: number; //画布多长
	scale: number; //现在的倍率
	scroll: number; //工作区滚了多少
}

export function Ruler({ length, scale, scroll, xOry }: RulerProps) {
	const isX = xOry === "x"; // 新增：是不是横的
	let step;
	if (scale < 0.25)
		step = 500; // 缩得很小：每 500px 写一个
	else if (scale < 0.5) step = 200;
	else if (scale < 1) step = 100;
	else step = 50; // 放大：写密一点
	const minor = step / 5; //小刻度的间隔
	const ticks: number[] = []; //一排线
	for (let v = 0; v <= length; v += minor) ticks.push(v); // 假设 step 是 50，那么每隔 10（画布单位）画一条线
	return (
		<div
			// {/* 外层：整把标尺 */}
			className={
				isX
					? "absolute left-7  right-0 top-0 z-20  h-7 overflow-hidden border-b border-slate-200 bg-white"
					: "absolute left-0  top-7 bottom-0 z-20 w-7 overflow-hidden border-r border-slate-200 bg-white "
			}
		>
			{/* 里层：一条条刻度线 */}
			{ticks.map((v) => {
				const isMajor = v % step === 0; //能被当前的大阶梯除尽，说明可以写数字
				return (
					<div
						key={v}
						className=" bg-slate-300 absolute"
						style={
							isX
								? {
										left: v * scale - scroll,
										top: 0,
										width: 1,
										height: isMajor ? 28 : 6,
									}
								: {
										left: 0,
										top: v * scale - scroll,
										width: isMajor ? 28 : 6,
										height: 1,
									}
						}
					>
						{isMajor && ( // 只有大刻度写数字
							<span className="absolute left-0.5 top-0.5 text-[10px] text-slate-400">
								{v}
							</span>
						)}
					</div>
				);
			})}
		</div>
	);
}
