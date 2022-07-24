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

export interface Auth {
	token: string;
	user: AuthUser;
}

export interface LoginPayload {
	username: string;
	password: string;
}
