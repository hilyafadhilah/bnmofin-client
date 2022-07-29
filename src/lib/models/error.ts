import axios from "axios";

export class AppError {
	public title: string;
	public message: string;

	constructor(err?: any) {
		this.title = AppError.getTitle(err);
		this.message = AppError.getMessage(err);
	}

	static getTitle(error: any) {
		if (axios.isAxiosError(error)) {
			const data: any = error.response?.data;
			if (data?.error?.title) {
				return data.error.title;
			}

			return "Connection Error";
		}

		return error.title ?? "Unknown Error";
	}

	static getMessage(error: any) {
		if (axios.isAxiosError(error)) {
			const data: any = error.response?.data;
			if (data?.error?.message) {
				return data.error.message;
			}

			return "Error while connecting to the server. Please try again later.";
		}

		return (
			error.message ?? "An unknown error has occured. Please try again later."
		);
	}
}

export class UnauthorizedError extends AppError {
	constructor(resource = "this page") {
		super({
			title: "Unauthorized",
			message: `You are unauthorized to access ${resource}.`,
		});
	}
}

export class SessionExpiredError extends AppError {
	constructor() {
		super({
			title: "Session Expired",
			message: "Session has expired, please log in again.",
		});
	}
}
