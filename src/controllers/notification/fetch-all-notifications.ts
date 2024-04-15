import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Db } from 'mongodb';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
export async function fetchAllNotifications(ctx: Context) {
	try {
		const db: Db = await mongodbClient({ database: 'props' });
		const collection = db.collection('notifications');

		ctx.body = createUniversalResponse({ ctx, status: 200, data: 'GOODBYE WORLD' });
	} catch (error) {
		throw error;
	}
}
