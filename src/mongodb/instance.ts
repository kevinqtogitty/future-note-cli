const { MongoClient: MongoDBClient } = require('mongodb');
import { Db, MongoClient } from 'mongodb';
import 'dotenv/config';

interface Props {
	database?: string;
}

async function mongodbClient({ database }: Props): Promise<Db> {
	const uri = process.env.MONGODBCONNECTIONSTRING;
	const client: MongoClient = new MongoDBClient(uri);
	await client.connect();

	return client.db(database || 'prod');
}
export default mongodbClient;
