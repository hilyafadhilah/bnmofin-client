export const isInRoute = (path: string, route: string) =>
	route === "/" ? path === "/" : path.startsWith(route);
