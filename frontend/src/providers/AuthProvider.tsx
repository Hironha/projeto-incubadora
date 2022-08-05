import { authStorage } from "@utils/auth";
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
	const [token, setToken] = useState<string | null>(authStorage.getToken());

	const changeToken = useCallback((token: string) => {
		authStorage.setToken(token);
		setToken(token);
	}, []);

	const clearToken = useCallback(() => {
		setToken(null);
		localStorage.clear();
	}, []);

	return (
		<AuthContext.Provider value={{ token, changeToken, clearToken }}>
			{children}
		</AuthContext.Provider>
	);
};
