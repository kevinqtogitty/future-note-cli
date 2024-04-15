import { ApiKeyResults } from 'generate-api-key';

interface ApiKey {
	key: ApiKeyResults;
	id: string;
	createdAt: number;
	expiration: number;
	isExpired: boolean;
	type: string;
}

const Actions = {
	generate: 'generateApiKey',
	validate: 'validateApiKey'
} as const;

type ApiKeyAction = (typeof Actions)[keyof typeof Actions];

export { ApiKey, ApiKeyAction };
