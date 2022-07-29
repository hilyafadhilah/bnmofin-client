import TimeAgo from "javascript-time-ago";
import en from "$root/assets/locales/timeago-en";

export function moneyFormat(num: number, currency = "IDR") {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency,
	}).format(num);
}

TimeAgo.addLocale(en);
export const timeAgo = new TimeAgo("en-US");
