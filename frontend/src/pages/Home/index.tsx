import { Outlet, Route, Routes } from "react-router-dom";

import { Layout } from "@components/Layout";
import { Overview, Tabs } from "./components";
import { Container, PageWrapper } from "./styles";

export const Home = () => {
	const homeContainer = (
		<Layout>
			<Container>
				<PageWrapper>
					<Tabs />
					<Outlet />
				</PageWrapper>
			</Container>
		</Layout>
	);

	return (
		<Routes>
			<Route path="/" element={homeContainer}>
				<Route path="/" element={<Overview />}></Route>
				<Route path="/monitor" element={<div>teste</div>}></Route>
			</Route>
		</Routes>
	);
};
