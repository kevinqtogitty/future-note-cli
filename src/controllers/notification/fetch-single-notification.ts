import mongodbClient from '@mongodb/instance';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
import { Context } from 'koa';
import { Collection, Db } from 'mongodb';

export async function fetchSingleNotification(ctx: Context) {
	const { id } = ctx.params;

	try {
		const db: Db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Notification> = db.collection('notifications');
		const document: Notification | null = await collection.findOne({ id });

		ctx.body = createUniversalResponse({ ctx, status: 200, data: document });
	} catch (error) {
		throw error;
	}
}
