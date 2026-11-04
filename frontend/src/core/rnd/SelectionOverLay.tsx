interface SelectionOverlayProps {
	/** 组件显示名称 */
	name: string;
	/** 组件靠近画布顶部时标签需要翻转到下方 */
	isReverseTop: boolean;
	/** 删除按钮回调 */
	onDelete: (event: React.MouseEvent) => void;
	/** 取消选中回调 */
	onCancel: (event: React.MouseEvent) => void;
}
export function SelectionOverLay({
	name,
	isReverseTop,
	onDelete,
	onCancel,
}: SelectionOverlayProps) {
	return (
		<>
			{/* 四边全包围的高亮边框 */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					border: "1px solid #1677ff",
					boxShadow: "0 0 0 1px rgba(22,119,255,0.3)",
					//圆角
					borderRadius: 2,
					//这个元素不接受鼠标/指针的命中
					pointerEvents: "none",
				}}
			></div>

			{/* 名称标签：靠近顶部时翻转到组件下方 */}
			<div
				style={{
					position: "absolute",
					...(isReverseTop ? { bottom: -20, left: 0 } : { top: -18, left: 0 }),
					padding: "0 6px",
					height: 16,
					lineHeight: "16px",
					fontSize: 12,
					backgroundColor: "#1677ff",
					color: "#ffffff",
					borderRadius: 2,
					whiteSpace: "nowrap",
				}}
			>
				{name}
			</div>
			{/* 删除取消按钮组 */}
			<div
				style={{
					position: "absolute",
					...(isReverseTop ? { bottom: -20, right: 0 } : { top: -18, right: 0 }),
					display: "flex",
					gap: "4px",
				}}
			>
				<div
					style={{
						padding: "0 6px",
						height: 16,
						lineHeight: "16px",
						fontSize: 12,
						backgroundColor: "#ff4d4f",
						color: "#ffffff",
						borderRadius: 2,
						cursor: "pointer",
						userSelect: "none",
					}}
					onClick={onDelete}
				>
					删除
				</div>
				<div
					style={{
						padding: "0 6px",
						height: 16,
						lineHeight: "16px",
						fontSize: 12,
						backgroundColor: "rgba(0,0,0,0.65)",
						color: "#ffffff",
						borderRadius: 2,
						cursor: "pointer",
						userSelect: "none",
					}}
					onClick={onCancel}
				>
					取消
				</div>
			</div>
		</>
	);
}
