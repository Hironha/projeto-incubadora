import { useContext } from "react";
import { Outlet, type RouteObject } from "react-router-dom";

import { Redirect } from "@components/Redirect";
import { PageLayout } from "@components/Layout";
import { SignUpForm } from "./components";
import { PageWrapper } from "@styles/page";

import { AuthContext } from "@providers/AuthProvider";

export const useSignUpRoutes = (): RouteObject[] => {
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
			children: [{ path: "/sign-up", element: <SignUpForm /> }],
		},
	];
};
