import { writable } from "svelte/store";
import * as Cookies from "es-cookie";
import type { Auth } from "$lib/models/auth";
import { api } from "$lib/services/api";
import { browser } from "$app/env";

function createAuth() {
	const auth = writable<Auth | null | undefined>();

	// fill values based on token
	const fetch = async (token?: string) => {
		if (token) {
			try {
				const user = await api.getAuthUser(token);
				auth.set({ token, user });
			} catch (err) {
				auth.set(null);
				throw err;
			}
		} else {
			auth.set(null);
		}
	};

	// cookie & session
	auth.subscribe((value) => {
		if (browser && value !== undefined) {
			if (value) {
				Cookies.set("token", value.token);
			} else {
				Cookies.remove("token");
			}
		}
	});

	// login
	async function login(username: string, password: string) {
		try {
			const value = await api.login({ username, password });
			auth.set(value);
		} catch (err) {
			auth.set(null);
			throw err;
		}
	}

	// Axios interceptor

	// const interceptors = {
	// 	request: [] as number[],
	// 	response: [] as number[],
	// };

	// auth.subscribe((value) => {
	// 	if (value != null) {
	// 		// add auth token header
	// 		interceptors.request.push(
	// 			api.interceptors.request.use((request) => {
	// 				request.headers = {
	// 					...request.headers,
	// 					Authorization: `Bearer ${value.token}`,
	// 				};
	// 				return request;
	// 			}),
	// 		);

	// 		// token invalid / expire
	// 		interceptors.response.push(
	// 			api.interceptors.response.use(
	// 				(response) => response,
	// 				(error) => {
	// 					if (axios.isAxiosError(error)) {
	// 						const { response } = <AxiosError<ErrorResponse>> error;
	// 						if (response != null && response.data != null && response.status === 401
	// 							&& (
	// 								response.data.error.name === 'TokenExpired'
	// 								|| response.data.error.name === 'InvalidToken'
	// 							)
	// 						) {
	// 							auth.set(null);
	// 						}
	// 					}

	// 					return Promise.reject(error);
	// 				},
	// 			),
	// 		);
	// 	} else {
	// 		// console.log(interceptors);
	// 		// interceptors.request.forEach(api.interceptors.request.eject);
	// 		// interceptors.response.forEach(api.interceptors.response.eject);
	// 	}
	// });

	// logout
	const logout = () => {
		auth.set(null);
	};

	if (browser) {
		fetch(Cookies.get("token"));
	}

	return {
		subscribe: auth.subscribe,
		login,
		logout,
		fetch,
	};
}

export const auth = createAuth();
