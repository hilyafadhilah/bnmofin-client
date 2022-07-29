import axios, { type AxiosRequestConfig } from "axios";
import { apiConfig } from "$root/config";
import type { ApiResponse } from "$models/api";
import type { Auth, CurrentUser, LoginPayload } from "$models/auth";
import type { RegisterPayload } from "$models/customer";

const fetch = axios.create({
	baseURL: apiConfig.url,
	timeout: apiConfig.timeout,
});

async function login(payload: LoginPayload) {
	const { data } = await fetch.post<ApiResponse<Auth>>("/auth", payload);
	return data.data;
}

async function getCurrentUser(token: string) {
	const { data } = await fetch.get<ApiResponse<CurrentUser>>("/auth", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return data.data;
}

async function register(payload: RegisterPayload) {
	const formData = new FormData();
	formData.append("user[username]", payload.user.username);
	formData.append("user[password]", payload.user.password);
	formData.append("fullname", payload.fullname);
	formData.append("idCardImage", payload.idCardImage);

	const { data } = await fetch.post<ApiResponse<Auth>>("/customer", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return data.data;
}

export interface ApiOptions {
	auth?: Auth;
	query?: Record<string, unknown>;
}

async function get<T>(endpoint: string, options?: ApiOptions) {
	const config: AxiosRequestConfig = {};

	if (options?.auth) {
		config.headers = {
			Authorization: `Bearer ${options.auth.token}`,
		};
	}

	if (options?.query) {
		config.params = options.query;
	}

	const { data } = await fetch.get<ApiResponse<T>>(endpoint, config);
	return data.data as T;
}

export interface ApiGetManyOptions {
	auth?: Auth;
	query?: Record<string, unknown>;
	skip?: number;
	take?: number;
}

async function getMany<T extends Array<any>>(
	endpoint: string,
	options?: ApiGetManyOptions
) {
	const config: AxiosRequestConfig = {};

	if (options) {
		const { auth, query, skip, take } = options;

		if (auth) {
			config.headers = {
				Authorization: `Bearer ${auth.token}`,
			};
		}

		config.params = {
			...query,
			skip,
			take,
		};
	}

	const { data } = await fetch.get<ApiResponse<T>>(endpoint, config);
	return data;
}

export interface ApiBodyOptions<T> extends ApiOptions {
	method: "post" | "put" | "patch";
	payload?: T;
}

async function send<Payload = any, Response = any>(
	endpoint: string,
	options: ApiBodyOptions<Payload> = {
		method: "post",
	}
) {
	const config: AxiosRequestConfig = {};

	if (options.auth) {
		config.headers = {
			Authorization: `Bearer ${options.auth.token}`,
		};
	}

	if (options?.query) {
		config.params = options.query;
	}

	const { data } = await fetch[options.method]<ApiResponse<Response>>(
		endpoint,
		options.payload,
		config
	);

	return data.data as Response;
}

export const api = {
	login,
	getCurrentUser,
	register,
	get,
	getMany,
	send,
};
