import { useContext } from "react";
import { Outlet } from "react-router-dom";

import { PageLayout } from "@components/Layout";
import { Redirect } from "@components/Redirect";
import { PageWrapper } from "@styles/page";
import { Control, Overview, Tabs } from "./components";

import { AuthContext } from "@providers/AuthProvider";

import { TabOptions } from "./components/Tabs";

import type { RouteObject } from "react-router-dom";

export const useHomeRoutes = (): RouteObject[] => {
	const { verifyAuthentication } = useContext(AuthContext);

	const tabs = [
		{ path: "/", value: TabOptions.OVERVIEW, text: "Monitoramento" },
		{ path: `/${TabOptions.CONTROL}`, value: TabOptions.CONTROL, text: "Controle" },
	];

	const homeContainer = (
		<Redirect to="/login" validation={!verifyAuthentication()}>
			<PageLayout>
				<PageWrapper>
					<Tabs tabs={tabs} />
					<Outlet />
				</PageWrapper>
			</PageLayout>
		</Redirect>
	);

	return [
		{
			element: homeContainer,
			children: [
				{ path: "/", element: <Overview /> },
				{ path: `/${TabOptions.CONTROL}`, element: <Control /> },
			],
		},
	];
};
