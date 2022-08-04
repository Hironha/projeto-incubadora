const tokenKey = "@auth-token";

const setToken = (token: string) => {
	localStorage.setItem(tokenKey, token);
};

const getToken = (): string | null => {
	return localStorage.getItem(tokenKey);
};

export const authStorage = {
	getToken,
	setToken,
};
