import { createUniversalError } from '@src/helpers/create-universal-error';
import initializeBugSnag from '@src/bugsnag/bugsnag-init';
import { CustomError } from '@src/types/errors';
import { Context } from 'koa';

export const errorHandler = async (ctx: Context, next: () => Promise<any>) => {
	const { Bugsnag } = initializeBugSnag();

	try {
		await next();
	} catch (error) {
		const err = error as CustomError;

		Bugsnag.notify(err, () => console.log('>>> ERROR FOUND AND BUGSNAG NOTIFIED'));

		ctx.body = createUniversalError({
			ctx,
			status: err.status || 500,
			data: { error: err.message || 'Internal server error' }
		});
	}
};
