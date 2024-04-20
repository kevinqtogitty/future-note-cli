import initializeBugSnag from '@src/bugsnag/bugsnag-init';
import mongodbClient from '@src/mongodb/instance';
import { CustomError } from '@src/types/errors';
import dayjs from 'dayjs';
import client from 'twilio';

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

async function sendMessage() {
	const twilio = client(accountSid, authToken);
	const { Bugsnag } = initializeBugSnag();
	let notificationsSuccessfullySent = 0;

	//find notifications that have the time an hour from now
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
			for (const i in documents) {
				//process docu
				// if successfult update notification sent
				notificationsSuccessfullySent++;
			}
		}
	} catch (error) {
		const err = error as CustomError;
		Bugsnag.notify(err, () => console.log('>>> ERROR FOUND AND BUGSNAG NOTIFIED'));
	}
}

module.exports.handler = sendMessage;
