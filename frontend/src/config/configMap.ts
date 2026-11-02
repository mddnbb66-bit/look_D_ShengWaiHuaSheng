import { textDefaultConfig } from "./basic-config/text.config";
import { ComponentNodeType } from "@/core/schema/ownType";
import { ComponentType } from "@/core/schema/commonType";
//类型-》默认数据
let shuz = 1;
const DefaultConfigMap: any = {
	Text: textDefaultConfig,
};
//

export const getNewComponentConfig = (type: ComponentType) => {
	return structuredClone(DefaultConfigMap[type]);
};
