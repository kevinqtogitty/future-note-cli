import Router from 'koa-router';
import {
	fetchAllMessages,
	fetchSingleMessage,
	postSingleMessage
} from '@src/controllers/message/consolidated';

const messageRouter = new Router();

messageRouter
	.get('/message', (ctx) => fetchAllMessages(ctx))
	.get('/message/:id', (ctx) => fetchSingleMessage(ctx))
	.post('/message', (ctx) => postSingleMessage(ctx));

export default messageRouter;
