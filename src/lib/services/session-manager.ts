import { remove, set } from "es-cookie";
import type { LoginPayload, Auth } from "$models/auth";
import { toast } from "$stores/toast";
import { api } from "$services/api";
import type { Writable } from "svelte/store";

const tokenCookieKey = import.meta.env.VITE_SESSION_COOKIE ?? "token";

async function fetchData(token: string | undefined): Promise<App.Session> {
	if (token) {
		try {
			const data = await api.getAuth(token);

			return {
				auth: { token, ...data },
			};
		} catch (err) {
			toast.error(err);
		}
	}

	return {};
}

async function login(session: Writable<App.Session>, payload: LoginPayload) {
	const auth = await api.send<LoginPayload, Auth>("/auth", {
		method: "post",
		payload,
	});

	session.update((value) => {
		value.auth = auth;
		return value;
	});

	set(tokenCookieKey, auth.token);
}

async function logout(session: App.Session) {
	delete session.auth;
	remove(tokenCookieKey);
}

export const sessionManager = {
	tokenCookieKey,
	fetchData,
	login,
	logout,
};
