export const apiConfig = {
	url: import.meta.env.VITE_API_URL,
	timeout: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) ?? 5000,
};

// Example for default currency env format:
// VITE_DEFAULT_CURRENCY="USD:United States Dollar"

const defaultCurrency = import.meta.env.VITE_DEFAULT_CURRENCY
	? import.meta.env.VITE_DEFAULT_CURRENCY.split(":")
	: ["IDR", "Indonesian Rupiah"];

export const moneyConfig = {
	defaultCurrency: {
		symbol: defaultCurrency[0],
		name: defaultCurrency[1],
	},
};
