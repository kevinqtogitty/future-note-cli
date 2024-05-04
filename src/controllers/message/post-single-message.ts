import { Context } from 'koa';
import mongodbClient from '@mongodb/instance';
import { Collection, Db, InsertOneResult } from 'mongodb';
import { Message, MessageRequest } from '@src/types/message';
import { createUniversalResponse } from '@src/helpers/create-universal-response';
import uniqId from 'uniqid';
import dayjs from 'dayjs';

export async function postSingleMessage(ctx: Context) {
	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection: Collection<Message> = db.collection('notifications');
		const requestBody = ctx.request.body as MessageRequest;

		if (!requestBody?.message || !requestBody?.date) {
			throw new Error('Missing one of the following - alert, message, or date in your request');
		}

		const { message, date, phoneNumber } = requestBody;

		if (date < dayjs().unix()) {
			throw new Error('No way Jose, cannot schedule a notification in the past');
		}

		const scheduledMessage: Message = {
			type: 'MESSAGE',
			id: uniqId(),
			message,
			date,
			isSent: false,
			createdAt: dayjs().unix(),
			isDeleted: false,
			phoneNumber
		};

		const { acknowledged }: InsertOneResult = await collection.insertOne(scheduledMessage);

		if (!acknowledged) {
			throw new Error('Failed to insert notification request into MongoDB');
		}

		ctx.body = createUniversalResponse({ ctx, status: 200, data: { scheduledMessage } });

		console.log('Succesfully entered in notification');
	} catch (error) {
		throw error;
	}

	return;
}
