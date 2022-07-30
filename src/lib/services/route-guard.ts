import { AuthRole } from "../models/auth";
import { isInRoute } from "../utils/component";

export type VisitorRole = "guest" | "customer" | "admin";

const routes = [
	"/",
	"/login",
	"/register",
	"/customers",
	"/requests",
	"/transactions",
	"/logout",
];

const whitelist: Record<VisitorRole, string[]> = {
	guest: ["/login", "/register"],
	customer: ["/", "/requests", "/transactions", "/logout"],
	admin: ["/", "/customers", "/requests", "/transactions", "/logout"],
};

function getRole(session: App.Session) {
	return session.auth
		? session.auth.user.role === AuthRole.Admin
			? "admin"
			: "customer"
		: "guest";
}

/**
 * If a given role goes to a route for another role,
 * where should the visitor be redirected to?
 */
const redirects = {
	guest: "/login",
	customer: "/",
	admin: "/",
};

function isAuthorized(role: VisitorRole, path: string) {
	return (
		!routes.includes(path) ||
		whitelist[role].some((route) => isInRoute(path, route))
	);
}

export const routeGuard = {
	isAuthorized,
	getRole,
	redirects,
};
