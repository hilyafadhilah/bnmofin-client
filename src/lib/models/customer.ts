export interface RegisterPayload {
	user: {
		username: string;
		password: string;
	};
	fullname: string;
	idCardImage: File;
}

export interface Customer {
	id: number;
}
