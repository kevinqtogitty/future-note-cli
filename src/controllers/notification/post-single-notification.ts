import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Collection, Db } from 'mongodb';
import Notification from '@src/types/notification';

export async function postSingleNotification(ctx: Context) {
	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Notification> = db.collection('notifications');

		await collection.insertOne({
			id: '123',
			message: 'HELLO WORlD',
			date: 'TODAY',
			sent: false,
			createdAt: 'NOW',
			isDeleted: false
		});

		console.log('Succesfully entered in notification');
	} catch (error) {
		throw error;
	}

	return;
}
