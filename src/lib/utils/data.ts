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
