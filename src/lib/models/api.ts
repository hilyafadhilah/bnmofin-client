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
		skip: number;
		take: number;
		total: number;
	};
}

export type ApiResponse<T> = T extends Array<infer I>
	? ApiCollectionResponse<I>
	: ApiSingularResponse<T>;

export interface ApiError {
	name: string;
	title: string;
	message: string;
}

export interface ErrorResponse<T = any> {
	error: ApiError;
	meta: {
		timestamp: Date;
	};
	data: T;
}
