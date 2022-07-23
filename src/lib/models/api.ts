export interface ApiSingularResponse<T> {
	data: T;
	meta: {
		items: number;
		timestamp: Date;
	};
}

export interface ApiCollectionResponse<T> {
	data: T[];
	meta: {
		timestamp: Date;
		items: number;
		totalItems: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

export type ApiResponse<T> = T extends Array<infer I>
	? ApiCollectionResponse<I>
	: ApiSingularResponse<T>;

export interface ErrorResponse<T = any> {
	error: {
		name: string;
		title: string;
		message: string;
	};
	meta: {
		timestamp: Date;
	};
	data: T;
}
