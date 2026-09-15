import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ProjectList from "../components/projects/ProjectList.tsx";
import AuthPage from "../components/login/AuthPage.jsx";
//路由守卫

export const AuthGurad = () => {
	const token = localStorage.getItem("token");
	if (!token) {
		return <Navigate to="/auth" replace></Navigate>;
	}
	return <Outlet />;
};

export const router = createBrowserRouter([
	{
		path: "/auth",
		Component: AuthPage,
	},
	{},
	{
		element: <AuthGurad />,
		children: [
			{
				path: "/projects",
				Component: ProjectList,
			},
		],
	},
]);
