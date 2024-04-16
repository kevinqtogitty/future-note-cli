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

		if (!requestBody?.alert || !requestBody?.message || !requestBody?.date) {
			throw new Error('Missing one of the following - alert, message, or date in your request');
		}

		const { alert, message, date } = requestBody;

		if (date < dayjs().unix()) {
			throw new Error('No way Jose, cannot schedule a notification in the past');
		}

		const notificationRequest: Notification = {
			type: 'NOTIFICATION',
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
