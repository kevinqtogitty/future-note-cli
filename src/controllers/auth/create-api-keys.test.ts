const { MongoClient: MongoDBClient } = require('mongodb');
import { createApiKey } from './create-api-key';
import { createMockContext } from '@shopify/jest-koa-mocks';
import { describe, test, expect } from '@jest/globals';
import { Db, MongoClient } from 'mongodb';
import { generateOrValidateApiKey } from '@src/helpers/create-or-validate-api-key';

const mockCtx = createMockContext();

const ctxWithoutToken = {
	...mockCtx,
	headers: {
		authorization: ''
	}
};

const ctxWithToken = {
	...mockCtx,
	headers: {
		authorization: 'Bearer mock-token-1234'
	}
};

jest.mock('@helpers/create-or-validate-api-key', () => ({
	generateOrValidateApiKey: jest.fn().mockResolvedValue('mock-api-key')
}));

describe('Test creating api keys', () => {
	let connection: MongoClient;
	let db: Db;

	beforeAll(async () => {
		connection = new MongoDBClient(process.env.MONGODBCONNECTIONSTRING);
		db = connection.db('prod');
	});

	afterAll(async () => {
		await connection.close();
	});

	test('Creates api key', async () => {
		const expected = {
			statusCode: 200,
			body: {
				apiKey: 'mock-api-key',
				info: 'This key will expire in 6 months, store it in a safe and secure place'
			}
		};

		expect(await createApiKey(ctxWithoutToken)).toEqual(undefined);
		expect(generateOrValidateApiKey).toHaveBeenCalledWith({
			action: 'generateApiKey'
		});
		expect(expected).toStrictEqual(ctxWithoutToken.body);
	});

	test("Api key exists, doesn't create an api key", async () => {
		const expected = undefined;

		expect(await createApiKey(ctxWithToken)).toEqual(undefined);
		expect(ctxWithToken.headers.authorization).toBe('Bearer mock-token-1234');
		expect(generateOrValidateApiKey).toHaveBeenCalledWith({
			action: 'generateApiKey'
		});
		expect(expected).toStrictEqual(ctxWithToken.body);
	});
});
