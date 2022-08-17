import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
	baseURL: `http://${import.meta.env.VITE_API_HOSTNAME}`,
	timeout: 60 * 1000,
	validateStatus: status => {
		return status >= 200 && status <= 300;
	},
});

api.interceptors.request.use(
	async config => {
		config.headers = {
			Accept: "application/json",
			"Content-Type": "application/json",
		};
		return config;
	},
	error => Promise.reject(error)
);

api.interceptors.response.use(
	async response => response,
	async error => {
		const user = getAuth().currentUser;
		if (error?.response?.data?.code === 403 && !error.config._retry && user) {
			error.config._retry = true;
			const token = await user.getIdToken(true);
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			return api(error.config);
		}
		return Promise.reject(error);
	}
);
