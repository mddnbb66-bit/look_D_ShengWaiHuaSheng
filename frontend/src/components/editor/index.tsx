import { useParams } from "react-router-dom";

export default function EditorIndex() {
	const { id } = useParams<{ id: string }>(); //从url解构出项目传入的项目id
	return (
		<>
			<p>这是主编辑页</p>
			<hr />
			<p>这个项目的id:{id}</p>
		</>
	);
}
