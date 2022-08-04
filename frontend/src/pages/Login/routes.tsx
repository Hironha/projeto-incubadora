import { Outlet } from "react-router-dom";
import { PageLayout } from "@components/Layout";
import { LoginForm } from "./components";

import type { RouteObject } from "react-router-dom";

export const getRoutes = (): RouteObject[] => [
	{
		element: (
			<PageLayout>
				<Outlet></Outlet>
			</PageLayout>
		),
		children: [{ path: "/login", element: <LoginForm /> }],
	},
];
