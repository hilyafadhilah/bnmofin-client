import type { CustomerCustomerResponse } from "./customer";
import type { Money } from "./money";

export interface TransactionResponse {
	id: number;
	senderId: number;
	receiverId: number;
	amount: number;
	created: string;
	sender: CustomerCustomerResponse;
	receiver: CustomerCustomerResponse;
}

export interface TransferPayload {
	money: Money;
	username: string;
}

export interface TransferResponse extends TransactionResponse {
	sender: CustomerCustomerResponse & {
		balance: number;
	};
}
