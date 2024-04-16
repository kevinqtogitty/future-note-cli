import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Collection, Db } from 'mongodb';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
export async function fetchAllNotifications(ctx: Context) {
	try {
		const db: Db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Notification> = db.collection('notifications');
		const documents = await collection.find({ type: 'NOTIFICATION' }).toArray();

		ctx.body = createUniversalResponse({ ctx, status: 200, data: documents });
	} catch (error) {
		throw error;
	}
}
