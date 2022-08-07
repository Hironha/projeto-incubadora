import { useState, createContext, useEffect, useCallback } from "react";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";

import { Loading } from "@components/Loading";
import { LoadingContainer } from "./styles";

interface IAuthContext {
	verifyAuthentication: () => boolean;
	getToken: (refresh?: boolean) => Promise<string | null>;
}

type AuthProviderProps = {
	children?: React.ReactNode;
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [isAuthInitialized, setIsAuthInitialized] = useState(false);

	const verifyAuthentication = useCallback(() => {
		const user = getAuth().currentUser;
		return user ? true : false;
	}, []);

	const getToken = useCallback(async (refresh = false) => {
		const user = getAuth().currentUser;
		if (!user) return null;
		return await user.getIdToken(refresh);
	}, []);

	useEffect(() => {
		const initAuth = async () => {
			const auth = getAuth();
			await setPersistence(auth, browserSessionPersistence);
			setIsAuthInitialized(true);
		};

		initAuth();
	}, []);

	if (!isAuthInitialized) {
		return (
			<LoadingContainer>
				<Loading size="large" />
			</LoadingContainer>
		);
	}

	return (
		<AuthContext.Provider value={{ verifyAuthentication, getToken }}>
			{children}
		</AuthContext.Provider>
	);
};
