export interface AuthUser {
	id: number
	username: string
	role: string
	created: Date
}

export interface Auth {
	token: string
	user: AuthUser
}

export interface LoginPayload {
	username: string
	password: string
}
