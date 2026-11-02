import type React from "react";
//下面是svg图标库
import {
	AlignJustify,
	Box,
	Clock3,
	Image,
	MousePointerClick,
	TrendingUp,
	Activity,
	Timer,
	Minus,
	Bell,
	TagIcon,
	UserCircle,
	Star,
	ToggleLeft,
} from "lucide-react";
import { DraggableItem } from "@/core/dnd-kit/DraggableItem";

interface ComponentItem {
	type: string;
	name: string;
	icon?: React.ReactNode;
}
function PanelItem({ type, name, icon }: ComponentItem) {
	return (
		//单独1个的配置
		<DraggableItem componentType={type}>
			<div className="w-[100px] h-[100px] flex flex-col items-center justify-evenly rounded-lg border border-slate-200 bg-white cursor-grab text-slate-500 text-xs transition-all duration-200 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-600 active:scale-95 shadow-soft">
				<div>{icon}</div>
				<p>{name}</p>
			</div>
		</DraggableItem>
	);
}
export function BasicPanel() {
	const component: ComponentItem[] = [
		{ type: "Text", name: "文字组件", icon: <AlignJustify className="h-5 w-5" /> },
	];
	return (
		//很多组件的布局 是2列，
		<>
			<div className="w-[265px] grid grid-cols-2 grid-rows-component gap-[12px] p-[12px]">
				{component.map((item) => (
					<PanelItem key={item.type} {...item} />
				))}
			</div>
		</>
	);
}
