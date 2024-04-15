import { Context } from 'vm';
import { GeneralResponse } from '@src/types/response';

interface Props {
	status: number;
	data?: any;
	ctx: Context;
}

// When testing locally we have to return the status the traditional koa way
// But we need to also satisfy the API Gateways expections
export function createUniversalResponse({ ctx, status, data }: Props): GeneralResponse {
	ctx.status = status;
	// console.log({
	// 	data,
	// 	status
	// });
	return {
		statusCode: status,
		body: data ? data : {}
	};
}
