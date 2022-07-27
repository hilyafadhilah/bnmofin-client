import type { Money } from "./money";

export interface AdminRequestResponse {
	id: number;
	customerId: number;
	amount: number;
	created: string;
	customer: {
		fullname: string;
		balance: number;
		user: {
			username: string;
		};
	};
	response: null | RespondRequestResponse;
}

export interface RespondRequestResponse {
	status: RequestResponseStatus;
	responder: {
		username: string;
	};
}

export interface CustomerRequestResponse {
	id: number;
	amount: number;
	created: string;
	response: null | {
		status: RequestResponseStatus;
	};
}

export type RequestResponseStatus = "accepted" | "declined";

export type RespondRequestPayload = { status: RequestResponseStatus };

export type NewRequestPayload = { money: Money };
