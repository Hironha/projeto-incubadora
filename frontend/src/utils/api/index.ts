import axios from "axios";
import { getAuth } from "firebase/auth";

import { authStorage } from "@utils/auth";

export const api = axios.create({
	baseURL: "https://api.example.com",
	timeout: 60 * 1000,
	validateStatus(status) {
		return status >= 200 || status < 400;
	},
});

api.interceptors.request.use(
	async config => {
		config.headers = {
			Accept: "application/json",
			"Content-Type": "application/x-www-form-urlencoded",
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
			authStorage.setToken(token);
			api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

			return api(error.config);
		}
		return Promise.reject(error);
	}
);
