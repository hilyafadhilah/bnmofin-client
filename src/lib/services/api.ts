import axios, { type AxiosRequestConfig } from "axios";
import type { ApiResponse } from "$lib/models/api";
import type { Auth, AuthUser, LoginPayload } from "$lib/models/auth";
import type { RegisterPayload } from "../models/customer";

const fetch = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 5000,
});

async function login(payload: LoginPayload) {
	const { data } = await fetch.post<ApiResponse<Auth>>("/auth", payload);
	return data.data;
}

async function getAuthUser(token: string) {
	const { data } = await fetch.get<ApiResponse<AuthUser>>("/auth", {
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
	page?: number;
	pageSize?: number;
}

async function getMany<T extends Array<any>>(
	endpoint: string,
	options?: ApiGetManyOptions
) {
	const config: AxiosRequestConfig = {};

	if (options?.auth) {
		config.headers = {
			Authorization: `Bearer ${options.auth.token}`,
		};
	}

	if (options?.query) {
		config.params = options.query;
	} else {
		config.params = {};
	}

	config.params.page = options?.page ?? 1;

	if (options?.pageSize) {
		config.params.pageSize = options.pageSize;
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

	return data.data;
}

export const api = {
	login,
	getAuthUser,
	register,
	get,
	getMany,
	send,
};
