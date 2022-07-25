import type { GetSession, Handle } from "@sveltejs/kit";
import { parse } from "es-cookie";
import { sessionManager } from "./lib/services/session-manager";

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
	const session = await sessionManager.fetchData(
		locals.cookie[sessionManager.tokenCookieKey]
	);
	return session;
};
