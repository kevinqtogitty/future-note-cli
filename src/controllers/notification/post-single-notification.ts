import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Collection, Db, InsertOneResult } from 'mongodb';
import { Notification, NotificationRequest } from '@src/types/notification';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
import uniqId from 'uniqid';
import dayjs from 'dayjs';

export async function postSingleNotification(ctx: Context) {
	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Notification> = db.collection('notifications');
		const requestBody = ctx.request.body as NotificationRequest;
		const { alert, message, date } = requestBody;
		const notificationRequest: Notification = {
			id: uniqId(),
			alert,
			message,
			date,
			isSent: false,
			createdAt: dayjs().unix(),
			isDeleted: false
		};

		const { acknowledged }: InsertOneResult = await collection.insertOne(notificationRequest);

		if (!acknowledged) {
			throw new Error('Failed to insert notification request into MongoDB');
		}

		ctx.body = createUniversalResponse({ ctx, status: 200, data: { notificationRequest } });

		console.log('Succesfully entered in notification');
	} catch (error) {
		throw error;
	}

	return;
}
