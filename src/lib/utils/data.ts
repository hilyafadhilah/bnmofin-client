import TimeAgo from "javascript-time-ago";
import en from "$root/assets/locales/timeago-en";

export function idrFormat(num: number) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(num);
}

export function moneyFormat(num: number, currency: string) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency,
	}).format(num);
}

TimeAgo.addDefaultLocale(en);
export const timeAgo = new TimeAgo("en-US");
