import { Navigate } from "react-router-dom";

type AuthPageProps = {
	children?: React.ReactNode;
	validation: boolean;
	to: string;
};

export const Redirect = ({ children, validation, to }: AuthPageProps) => {
	if (validation) {
		return <Navigate to={to} replace></Navigate>;
	}

	return <>{children}</>;
};
