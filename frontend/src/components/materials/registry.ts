import React from "react";
import TextComponent from "./basic/Text";
import { ComponentNodeType } from "@/core/schema/ownType";
import { PageDSL } from "@/core/schema/page";
import { RootContainerComponent } from "./basic/RootContainer";
//一个注册好的组件长啥样
//渲染器给参数，容器组件额外拿着孩子
export type RegistryOkCommponent = (props: {
	node: ComponentNodeType | PageDSL | ComponentNodeType[];
	renderChildren?: (children: ComponentNodeType[]) => React.ReactNode;
	mode?: "edit" | "preview";
}) => React.ReactNode; //React.ReactNode   所有可以被 React 渲染的内容
//下面是注册好的组件
export const componentRegistryMap = new Map<string, RegistryOkCommponent>([
	["Text", TextComponent as RegistryOkCommponent],
]);
componentRegistryMap.set("RootContainer", RootContainerComponent as RegistryOkCommponent);
