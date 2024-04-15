import { Context } from 'vm';
import { ErrorResponse } from '@src/types/errors';
interface Props {
	status: number;
	data: {
		error: string;
	};
	ctx: Context;
}

export function createUniversalError({ ctx, status, data }: Props): ErrorResponse {
	ctx.status = status;
	return {
		statusCode: status,
		body: data
	};
}
