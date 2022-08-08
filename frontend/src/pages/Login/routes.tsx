import { Outlet } from "react-router-dom";
import { PageLayout } from "@components/Layout";
import { LoginForm } from "./components";

import type { RouteObject } from "react-router-dom";
import { PageWrapper } from "@pages/Home/styles";

export const useLoginRoutes = (): RouteObject[] => [
	{
		element: (
			<PageLayout>
				<PageWrapper>
					<Outlet/>
				</PageWrapper>
			</PageLayout>
		),
		children: [{ path: "/login", element: <LoginForm /> }],
	},
];
