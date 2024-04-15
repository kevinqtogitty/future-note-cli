import initializeBugSnag from '@src/bugsnag/bugsnag-init';
import mongodbClient from '@src/mongodb/instance';
import { CustomError } from '@src/types/errors';
import dayjs from 'dayjs';

async function sendNotifications() {
	console.log('Sending notifications out');
	const { Bugsnag } = initializeBugSnag();
	let notificationsSuccessfullySent = 0;

	//find notifications that have the time an hour from now

	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection = db.collection('notifications');
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

module.exports.handler = sendNotifications;
