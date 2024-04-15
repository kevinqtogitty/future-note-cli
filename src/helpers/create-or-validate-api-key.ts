import mongodbClient from '@src/mongodb/instance';
import { generateApiKey } from 'generate-api-key';
import { Collection, Db } from 'mongodb';
import { ApiKey, ApiKeyAction } from '@src/types/api-keys';
import uniqid from 'uniqid';
import dayjs from 'dayjs';

interface Props {
	action: ApiKeyAction;
	apiKey?: string;
}

export async function generateOrValidateApiKey({ action, apiKey }: Props) {
	const db: Db = await mongodbClient({ database: 'prod' });
	const collection: Collection<ApiKey> = db.collection('apiKeys');

	try {
		switch (action) {
			case 'generateApiKey': {
				const apiKey = generateApiKey({ method: 'string' });
				await collection.insertOne({
					type: 'API_KEY',
					key: apiKey,
					id: uniqid(),
					createdAt: dayjs().unix(),
					expiration: dayjs().add(6, 'months').unix(),
					isExpired: false
				});

				return apiKey;
			}
			case 'validateApiKey': {
				const document = await collection.findOne({ key: apiKey });

				if (!document || dayjs().unix() > document?.expiration) {
					return false;
				} else if (document?.key === apiKey && !document?.isExpired) {
					return true;
				}
			}
			default:
				return false;
		}
	} catch (error) {
		throw error;
	}
}
