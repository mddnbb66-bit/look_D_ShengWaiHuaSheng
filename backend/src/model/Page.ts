import { model, Schema, Types } from "mongoose";

interface IPage {
	_id: Types.ObjectId;
	name: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	//core
	schema: Record<string, any>;
	ownerid: Types.ObjectId; //这是一个id
	createdAt: Date; //创建和更新日期，
	updatedAt: Date;
	toSafeJSON(): {
		pageId: Types.ObjectId;
		name: string;
		title: string;
		description: string;
		thumbnailUrl: string;
		schema: Record<string, any>; //core :这是一个对象，它的 key 是 string，value 可以是任意类型
		createdAt: Date;
		updatedAt: Date;
	};
}
//创建蓝图
const PageSchema = new Schema<IPage>(
	{
		name: { type: String, default: "" },
		title: { type: String, default: "" },
		description: { type: String, default: "" },
		thumbnailUrl: { type: String, default: "" },
		//core
		schema: { type: Object, required: true },

		//关联user

		ownerid: {
			type: Schema.Types.ObjectId,
			ref: "User", //引用的是 User 模型，而这个模型默认操作 MongoDB 的 users 集合。
			required: true,
			index: true, //添加数据库索引，也就是，
		},
	},
	{ timestamps: true }
);
//添加返回安全数据的方法
PageSchema.methods.toSafeJSON = function (this: IPage) {
	return {
		pageId: this._id,
		name: this.name,
		title: this.title,
		description: this.description,
		thumbnailUrl: this.thumbnailUrl,
		schema: this.schema,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};
//暴露接口
const Page = model<IPage>("Page", PageSchema);
export default Page;
// index: true,
//添加数据库索引，也就是，
// User A 的 ObjectId
// → Page 1 在哪
// → Page 2 在哪
// → Page 3 在哪

// User B 的 ObjectId
// → Page 4 在哪
// → Page 5 在哪
// → Page 6 在哪
