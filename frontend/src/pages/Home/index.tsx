import { Outlet, Route, Routes } from "react-router-dom";

import { Layout } from "@components/Layout";
import { Overview, Tabs } from "./components";
import { PageWrapper } from "./styles";

import { TabOptions } from "./components/Tabs";

export const Home = () => {
	const homeContainer = (
		<Layout>
			<PageWrapper>
				<Tabs />
				<Outlet />
			</PageWrapper>
		</Layout>
	);

	return (
		<Routes>
			<Route path="/" element={homeContainer}>
				<Route path={`/`} element={<Overview />}></Route>
				<Route path={`/${TabOptions.CONTROL}`} element={<div>teste</div>}></Route>
			</Route>
		</Routes>
	);
};
