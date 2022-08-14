import { useContext } from "react";
import { Outlet, type RouteObject } from "react-router-dom";

import { Redirect } from "@components/Redirect";
import { PageLayout } from "@components/Layout";
import { LoginForm } from "./components";
import { PageWrapper } from "@styles/page";

import { AuthContext } from "@providers/AuthProvider";

export const useLoginRoutes = (): RouteObject[] => {
	const { verifyAuthentication } = useContext(AuthContext);

	return [
		{
			element: (
				<Redirect to="/" validation={verifyAuthentication()}>
					<PageLayout>
						<PageWrapper>
							<Outlet />
						</PageWrapper>
					</PageLayout>
				</Redirect>
			),
			children: [{ path: "/login", element: <LoginForm /> }],
		},
	];
};
