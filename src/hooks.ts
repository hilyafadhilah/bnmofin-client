import type { GetSession, Handle } from "@sveltejs/kit";
import { parse } from "es-cookie";
import { api } from "./lib/services/api";

export const handle: Handle = async ({ event, resolve }) => {
	const cookieString = event.request.headers.get("cookie");
	event.locals.cookie = cookieString ? parse(cookieString) : {};

	let response: Response;
	try {
		response = await resolve(event);
	} catch (err) {
		// @TODO handle error
		response = new Response("Unknown Error");
	}

	return response;
};

export const getSession: GetSession = async ({ locals }) => {
	const session: App.Session = {};

	if (locals.cookie.token) {
		try {
			session.auth = {
				token: locals.cookie.token,
				user: await api.getAuthUser(locals.cookie.token),
			};
		} catch {
			// session = {}
		}
	}

	return session;
};
