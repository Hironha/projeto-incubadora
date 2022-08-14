import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "@providers/AuthProvider";

type AuthPageProps = {
	children?: React.ReactNode;
};

export const VerifyAuth = ({ children }: AuthPageProps) => {
	const { verifyAuthentication } = useContext(AuthContext);

	if (!verifyAuthentication()) {
		return <Navigate to="/login" replace></Navigate>;
	}

	return <>{children}</>;
};
