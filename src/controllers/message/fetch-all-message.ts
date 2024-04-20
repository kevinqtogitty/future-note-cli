import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Collection, Db } from 'mongodb';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
import { Message } from '@src/types/message';
export async function fetchAllMessages(ctx: Context) {
	try {
		const db: Db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Message> = db.collection('messages');
		const documents = await collection.find({ type: 'MESSAGE' }).toArray();

		ctx.body = createUniversalResponse({ ctx, status: 200, data: documents });
	} catch (error) {
		throw error;
	}
}
