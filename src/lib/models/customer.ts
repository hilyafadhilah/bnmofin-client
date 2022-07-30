import type { ApiStringFilter } from "./api";
import type { AuthRole } from "./auth";

export type CustomerStatus = "verified" | "unverified";

export interface Customer {
	userId: number;
	fullname: string;
	idCardImage: string;
	balance: number;
	status: CustomerStatus;
	created: string;
}

export interface RegisterPayload {
	user: {
		username: string;
		password: string;
	};
	fullname: string;
	idCardImage: File;
}

export interface AdminCustomerResponse {
	userId: number;
	fullname: string;
	idCardImage: string;
	balance: number;
	status: "verified" | "unverified";
	created: string;
	user: {
		username: string;
		created: string;
	};
}

export interface CustomerCustomerResponse {
	userId: number;
	fullname: string;
	user: {
		username: string;
	};
}

export type CustomerResponse<T extends AuthRole> = T extends AuthRole.Admin
	? AdminCustomerResponse
	: CustomerCustomerResponse;

export interface CustomerQuery {
	username?: ApiStringFilter;
	fullname?: ApiStringFilter;
}
