export interface AdminRequestResponse {
	id: number;
	customerId: number;
	amount: number;
	status: "awaiting" | "accepted" | "declined";
	created: string;
	customer: {
		fullname: string;
		user: {
			username: string;
		};
	};
}

export type RequestResponseStatus = "accepted" | "declined";

export type RespondRequestPayload = { status: RequestResponseStatus };
