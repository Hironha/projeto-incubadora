import { useRoutes } from "react-router-dom";

import { useLoginRoutes } from "./Login/routes";
import { useHomeRoutes } from "./Home/routes";
import { useSignUpRoutes } from "./SignUp/routes";

export const PageRoutes = () => {
	const routes = useRoutes([...useHomeRoutes(), ...useLoginRoutes(), ...useSignUpRoutes()]);

	return routes;
};
