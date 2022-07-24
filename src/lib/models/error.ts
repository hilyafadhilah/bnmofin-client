import { AxiosError } from "axios";

export class AppError {
	public title: string;
	public message: string;

	constructor(err: any) {
		this.title = AppError.getTitle(err);
		this.message = AppError.getMessage(err);
	}

	static getTitle(error: any) {
		if (error instanceof AxiosError) {
			if (error.response?.data?.error?.title) {
				return error.response.data.error.title;
			}

			return "Connection Error";
		}

		return error.title ?? "Unknown Error";
	}

	static getMessage(error: any) {
		if (error instanceof AxiosError) {
			if (error.response?.data?.error?.message) {
				return error.response.data.error.message;
			}

			return "Error while connecting to the server. Please try again later.";
		}

		return (
			error.message ?? "An unknown error has occured. Please try again later."
		);
	}
}
