import type { Money } from "./money";

export interface AdminRequestResponse {
	id: number;
	customerId: number;
	amount: number;
	status: RequestStatus;
	created: string;
	customer: {
		fullname: string;
		user: {
			username: string;
		};
	};
}

export interface CustomerRequestResponse {
	id: number;
	amount: number;
	status: RequestStatus;
	created: string;
}

export type RequestStatus = "awaiting" | "accepted" | "declined";

export type RequestResponseStatus = "accepted" | "declined";

export type RespondRequestPayload = { status: RequestResponseStatus };

export interface NewRequestPayload {
	money: Money;
}
