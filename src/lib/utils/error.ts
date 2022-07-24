import { AxiosError } from "axios";

export function isTokenError(error: any) {
	if (error instanceof AxiosError && error.response?.data?.error?.name) {
		const name = error.response.data.error.name;
		if (name === "InvalidToken" || name === "TokenExpired") {
			return true;
		}
	}

	return false;
}
