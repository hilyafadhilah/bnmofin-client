// /* eslint-disable no-param-reassign */
// import type { GetSession, Handle } from '@sveltejs/kit';
// import { get } from 'svelte/store';
// import { parse } from 'es-cookie';
// import { auth } from './stores/auth';
// import { api } from './services/api';

// export const handle: Handle = async ({ event, resolve }) => {
// 	const cookieString = event.request.headers.get('cookie');
// 	const cookie = cookieString ? parse(cookieString) : {};

// 	event.locals.cookie = cookie;

// 	// if (cookie.token) {
// 	// 	const auth = await api.getAuthUser(cookie.token);
// 	// }

// 	return resolve(event);
// };

// export const getSession: GetSession = async ({ locals }) => {
// 	await auth.fetch(locals.cookie.token);

// 	return {
// 		auth: get(auth),
// 	};
// };
