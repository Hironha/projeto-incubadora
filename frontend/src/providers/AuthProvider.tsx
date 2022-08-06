import { useState, createContext, useCallback } from "react";

interface IAuthContext {
	token: string | null;
	changeToken: (token: string) => void;
	clearToken: () => void;
}

type AuthProviderProps = {
	children?: React.ReactNode;
};

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [isAuthInitialized, setIsAuthInitialized] = useState(false);
	const [token, setToken] = useState<string | null>(null);

	const changeToken = useCallback((token: string) => {
		setToken(token);
	}, []);

	const clearToken = useCallback(() => {
		setToken(null);
	}, []);

	return (
		<AuthContext.Provider value={{ token, changeToken, clearToken }}>
			{isAuthInitialized ? children : null}
		</AuthContext.Provider>
	);
};
