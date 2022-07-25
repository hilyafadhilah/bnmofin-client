import type { Customer } from "./customer";

export enum AuthRole {
	Admin = "Admin",
	Customer = "VerifiedCustomer",
}

export interface AuthUser {
	id: number;
	username: string;
	role: AuthRole;
	created: Date;
}

export interface CurrentUser {
	user: AuthUser;
	customer?: Customer;
}

export interface Auth extends CurrentUser {
	token: string;
}

export interface LoginPayload {
	username: string;
	password: string;
}
