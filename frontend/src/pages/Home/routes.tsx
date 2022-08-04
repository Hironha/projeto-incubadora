import { Outlet } from "react-router-dom";

import { PageLayout } from "@components/Layout";
import { Overview, Tabs } from "./components";
import { PageWrapper } from "./styles";

import { TabOptions } from "./components/Tabs";

import type { RouteObject } from "react-router-dom";

export const getRoutes = (): RouteObject[] => {
	const tabs = [
		{ path: "/", value: TabOptions.OVERVIEW, text: "Monitoramento" },
		{ path: `/${TabOptions.CONTROL}`, value: TabOptions.CONTROL, text: "Controle" },
	];

	const homeContainer = (
		<PageLayout>
			<PageWrapper>
				<Tabs tabs={tabs} />
				<Outlet />
			</PageWrapper>
		</PageLayout>
	);

	return [
		{
			element: homeContainer,
			children: [
				{ path: "/", element: <Overview /> },
				{ path: `/${TabOptions.CONTROL}`, element: <div>teste</div> },
			],
		},
	];
};
