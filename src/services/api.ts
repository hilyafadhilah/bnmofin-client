import axios, { AxiosError } from 'axios';
import type { ApiResponse, ErrorResponse } from '$/models/api';
import type { Auth, AuthUser, LoginPayload } from '$/models/auth';

const instance = axios.create({
	baseURL: 'http://localhost:3030/',
	timeout: 5000,
});

async function login(payload: LoginPayload) {
	const { data } = await instance.post<ApiResponse<Auth>>('/auth', payload);
	return data.data;
}

async function getAuthUser(token: string) {
	const { data } = await instance.get<ApiResponse<AuthUser>>('/auth', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return data.data;
}

export const api = {
	login,
	getAuthUser,
};
