interface CustomError extends Error {
	status?: number;
}

interface ErrorResponse {
	statusCode: number;
	body: {
		error: string;
	};
}

export { CustomError, ErrorResponse };
