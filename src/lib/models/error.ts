import { AxiosError } from "axios";

export class AppError {
	public title: string;
	public message: string;

	constructor(err: any) {
		let error: any = err;

		if (error instanceof AxiosError) {
			if (error.response?.data) {
				error = error.response.data.error;
			} else {
				error = {
					title: "Connection Error",
					message:
						"Error while connecting to the server. Please try again later.",
				};
			}
		}

		this.title = error.title ?? "Unknown Error Occured";
		this.message =
			error.message ?? "An unknown error has occured. Please try again later.";
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
