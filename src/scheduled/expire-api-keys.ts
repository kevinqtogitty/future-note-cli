import initializeBugSnag from '@src/bugsnag/bugsnag-init';
import mongodbClient from '@src/mongodb/instance';
import { CustomError } from '@src/types/errors';
import dayjs from 'dayjs';

async function expireApiKeys() {
	console.log('Beginning hourly expiration of API keys');

	const hourNow = dayjs().format('h');
	const { Bugsnag } = initializeBugSnag();

	try {
		const db = await mongodbClient({ database: 'prod' });
		const collection = db.collection('apiKeys');
		const filter = {
			isExpired: false,
			expiration: {
				$lte: dayjs().unix()
			}
		};

		const { matchedCount, modifiedCount } = await collection.updateMany(filter, {
			$set: { isExpired: true }
		});

		console.log(
			`${matchedCount} API keys found to expire at ${hourNow} ${
				Number(hourNow) <= 12 ? 'PM' : 'AM'
			}, ${modifiedCount} documents expired`
		);
	} catch (error) {
		const err = error as CustomError;
		Bugsnag.notify(err);
	}
}

module.exports.handler = expireApiKeys;
