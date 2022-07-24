import type { GetSession, Handle } from "@sveltejs/kit";
import { parse } from "es-cookie";
import { api } from "./lib/services/api";

export const handle: Handle = async ({ event, resolve }) => {
	const cookieString = event.request.headers.get("cookie");
	event.locals.cookie = cookieString ? parse(cookieString) : {};

	return resolve(event);
};

export const getSession: GetSession = async ({ locals }) => {
	const session: App.Session = {};

	if (locals.cookie.token) {
		session.auth = {
			token: locals.cookie.token,
			user: await api.getAuthUser(locals.cookie.token),
		};
	}

	return session;
};
