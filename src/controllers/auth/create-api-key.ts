import { Context } from 'koa';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
import { generateOrValidateApiKey } from '@src/helpers/create-or-validate-api-key';

export async function createApiKey(ctx: Context) {
	try {
		const { authorization } = ctx.headers;
		const token = authorization?.split(' ')[1];

		if (!token) {
			const newApiKey = await generateOrValidateApiKey({ action: 'generateApiKey' });
			ctx.body = createUniversalResponse({
				ctx,
				status: 200,
				data: {
					apiKey: newApiKey,
					info: 'This key will expire in 6 months, store it in a safe and secure place'
				}
			});
		}
	} catch (error) {
		throw error;
	}
}
