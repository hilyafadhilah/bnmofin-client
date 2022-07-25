export type CurrenciesResponse = Record<string, string>;

export interface Money {
	currency: string;
	amount: number;
}
