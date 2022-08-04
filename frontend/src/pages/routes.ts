import { useRoutes } from "react-router-dom";

import { getRoutes as getLoginRoutes } from "./Login/routes";
import { getRoutes as getHomeRoutes } from "./Home/routes";

export const PageRoutes = () => {
	const routes = useRoutes([...getHomeRoutes(), ...getLoginRoutes()]);

	return routes;
};
