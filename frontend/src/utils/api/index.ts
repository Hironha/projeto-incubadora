import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
	baseURL: `http://${import.meta.env.VITE_API_HOSTNAME}`,
	timeout: 60 * 1000,
	validateStatus: status => {
		return status >= 200 && status <= 300;
	},
});

api.interceptors.request.use(async response => {
	if (response.headers) {
		if (!response.headers["Authorization"]) {
			const token = await getAuth().currentUser?.getIdToken();
			response.headers["Authorization"] = `Bearer ${token}`;
		}
	} else {
		const token = await getAuth().currentUser?.getIdToken();
		response.headers = {
			Authorization: `Bearer ${token}`,
		};
	}

	return Promise.resolve(response);
});

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
