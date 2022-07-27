import { page } from "$app/stores";
import { get } from "svelte/store";

export const isNavCurrent = (path: string) =>
	path === "/"
		? get(page).url.pathname === "/"
		: get(page).url.pathname.startsWith(path);
