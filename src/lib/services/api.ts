import axios from "axios";
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

export const api = {
	login,
	getAuthUser,
	register,
};
