import axios from "axios";

export function isTokenError(error: any) {
	if (axios.isAxiosError(error)) {
		const data: any = error.response?.data;
		if (data.error?.name) {
			const name = data.error.name;
			if (name === "InvalidToken" || name === "TokenExpired") {
				return true;
			}
		}
	}

	return false;
}
