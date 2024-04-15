import { generateOrValidateApiKey } from '@src/helpers/create-or-validate-api-key';
import { createUniversalError } from '@src/helpers/create-universal-error';
import { Context } from 'koa';

export async function authCheck(ctx: Context, next: () => Promise<any>) {
	const { authorization } = ctx.headers;
	const validUnauthenticatedPaths = ['POST/auth'];
	const tryingToAccessSecuredEndpoint = !validUnauthenticatedPaths.find(
		(path) => path === `${ctx.method}${ctx.path}`
	);

	if (tryingToAccessSecuredEndpoint) {
		if (!authorization) {
			ctx.status = 401;
			ctx.body = createUniversalError({
				ctx,
				status: 401,
				data: { error: 'This path requires a valid API key' }
			});

			return;
		}

		const isAuthenticated = await generateOrValidateApiKey({
			action: 'validateApiKey',
			apiKey: authorization?.split(' ')[1]
		});

		if (!isAuthenticated) {
			ctx.status = 401;
			ctx.body = createUniversalError({
				ctx,
				status: 401,
				data: { error: 'Invalid or expired API key provided' }
			});

			return;
		}
	}

	await next();
}
