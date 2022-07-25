import { get, remove, set } from "es-cookie";
import type { LoginPayload, Auth } from "$models/auth";
import { toast } from "$stores/toast";
import { api } from "$services/api";
import type { Writable } from "svelte/store";
import { SessionExpiredError } from "../models/error";
import { isTokenError } from "../utils/error";
import { browser } from "$app/env";

const tokenCookieKey = import.meta.env.VITE_SESSION_COOKIE ?? "token";

async function fetchData(token: string | undefined): Promise<App.Session> {
	if (token) {
		try {
			const data = await api.getCurrentUser(token);

			return {
				auth: { token, ...data },
			};
		} catch (err) {
			toast.error(err);
		}
	}

	return {};
}

async function refresh(
	store: Writable<App.Session>,
	session: App.Session
): Promise<void> {
	const token = session.auth?.token;
	if (!token) {
		return;
	}

	if (browser) {
		const cookie = get(tokenCookieKey);
		if (!cookie || token !== cookie) {
			throw new SessionExpiredError();
		}
	}

	try {
		const user = await api.getCurrentUser(token);
		store.update((value) => ({ ...value, auth: { token, ...user } }));
	} catch (err) {
		if (isTokenError(err)) {
			throw new SessionExpiredError();
		}

		throw err;
	}
}

async function login(session: Writable<App.Session>, payload: LoginPayload) {
	// assumed browser

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
	refresh,
	login,
	logout,
};
