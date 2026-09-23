import { Schema, model, type Document, type Types } from "mongoose";
// 表示 IUser 除了包含你定义的用户字段和方法，还包含 Mongoose 文档的能力，例如：user.save();user.deleteOne();user.updateOne();user._id;
// UserMethods：你自定义的实例方法，比如 toSafeJSON()
interface UserAttribite {
	email: string;
	passwordHash: string;
	createdAt: Date;
}
interface UserMethods {
	toSafeJSON(): {
		id: string;
		email: string;
		createdAt: Date;
	};
}
interface IUser extends Document, UserAttribite, UserMethods {
	_id: Types.ObjectId;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		passwordHash: {
			type: String,
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},

	{
		collection: "users",
	}
);
//返回后端的东西
UserSchema.methods.toSafeJSON = function (this: IUser) {
	return {
		email: this.email,
		id: this._id.toString(),
		createdAt: this.createdAt,
	};
};
const User = model<IUser>("User", UserSchema);

export default User;
// MongoDB
//   ↓ 查询结果
// Express 后端得到 user（包含 passwordHash）
//   ↓ 后端调用 user.toSafeJSON()
// 后端得到一个新对象（只有 id、email）
//   ↓ 后端调用 res.json(...) 发送响应
// 浏览器收到用户信息
