import { useRoutes } from "react-router-dom";

import { useLoginRoutes } from "./Login/routes";
import { useHomeRoutes } from "./Home/routes";

export const PageRoutes = () => {
	const routes = useRoutes([...useHomeRoutes(), ...useLoginRoutes()]);

	return routes;
};
