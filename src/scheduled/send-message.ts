import initializeBugSnag from '@src/bugsnag/bugsnag-init';
import mongodbClient from '@src/mongodb/instance';
import { CustomError } from '@src/types/errors';
import dayjs from 'dayjs';
const { Vonage } = require('@vonage/server-sdk');

const vonageApiKey = process.env.VONAGE_API_KEY;
const vonageApiSecret = process.env.VONAGE_API_SECRET;
const myPhoneNumber = Number(process.env.MY_PHONE_NUMBER);

async function sendMessage() {
	const { Bugsnag } = initializeBugSnag();
	let notificationsSuccessfullySent = 0;

	const vonage = new Vonage({
		apiKey: vonageApiKey,
		apiSecret: vonageApiSecret
	});

	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection = db.collection('messages');
		const filter = {
			sent: false,
			date: {
				$lte: dayjs().add(1, 'hour').unix()
			}
		};

		const documents = await collection.find(filter).toArray();
		if (documents.length) {
			for (const doc of documents) {
				const { message, phoneNumber } = doc;
				const result = await sendSMS(vonage, phoneNumber, myPhoneNumber, message);
				if (result) {
					notificationsSuccessfullySent++;
					continue;
				}
			}
		}
	} catch (error) {
		const err = error as CustomError;
		Bugsnag.notify(err, () => console.log('>>> ERROR FOUND AND BUGSNAG NOTIFIED'));
	}
}

module.exports.handler = sendMessage;

async function sendSMS(vonage: any, to: number, from: number, text: string) {
	const { response, error } = await vonage.sms.send({ to, from, text });

	if (error) {
		console.log('There was an error sending the messages.');
		throw new Error(error);
	}
	if (response) {
		console.log('Message sent successfully');
		return true;
	}
}
