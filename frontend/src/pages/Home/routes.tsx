import { Outlet } from "react-router-dom";

import { PageLayout } from "@components/Layout";
import { VerifyAuth } from "@components/VerifyAuth";
import { IncubatorControl, Overview, Tabs } from "./components";
import { PageWrapper } from "./styles";

import { TabOptions } from "./components/Tabs";

import type { RouteObject } from "react-router-dom";

export const useHomeRoutes = (): RouteObject[] => {
	const tabs = [
		{ path: "/", value: TabOptions.OVERVIEW, text: "Monitoramento" },
		{ path: `/${TabOptions.CONTROL}`, value: TabOptions.CONTROL, text: "Controle" },
	];

	const homeContainer = (
		<VerifyAuth>
			<PageLayout>
				<PageWrapper>
					<Tabs tabs={tabs} />
					<Outlet />
				</PageWrapper>
			</PageLayout>
		</VerifyAuth>
	);

	return [
		{
			element: homeContainer,
			children: [
				{ path: "/", element: <Overview /> },
				{ path: `/${TabOptions.CONTROL}`, element: <IncubatorControl /> },
			],
		},
	];
};
