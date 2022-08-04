import axios from "axios";

export const api = axios.create({
	baseURL: "https://api.example.com",
	timeout: 60 * 1000,
	validateStatus(status) {
		return status >= 200 || status < 400;
	},
});
