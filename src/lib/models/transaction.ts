export interface TransactionResponse {
	id: number;
	senderId: number;
	receiverId: number;
	amount: number;
	created: string;
	sender: {
		userId: number;
		fullname: string;
		user: {
			username: string;
		};
	};
	receiver: {
		userId: number;
		fullname: string;
		user: {
			username: string;
		};
	};
}
