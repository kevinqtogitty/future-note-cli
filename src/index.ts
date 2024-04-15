import 'module-alias/register';
import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-logger';
import koaHelmet from 'koa-helmet';
import parser from 'koa-bodyparser';

import notificationRouter from '@src/routers/notification/notification-router';
import { errorHandler } from '@middleware/error-handler';

import ServerlessHttp from 'serverless-http';
import initializeBugSnag from './bugsnag/bugsnag-init';
import authRouter from './routers/notification/auth-router';
import { authCheck } from './middleware/auth-check';

const server = new Koa();
const port = 3000;
const { handler: bugsnagHandler, bugsnagMiddlware } = initializeBugSnag();

server
	.use(bugsnagMiddlware!.requestHandler)
	.on('error', bugsnagMiddlware!.errorHandler)
	.use(authCheck)
	.use(errorHandler)
	.use(parser())
	.use(cors())
	.use(logger())
	.use(koaHelmet())
	.use(notificationRouter.routes())
	.use(authRouter.routes())
	// PORT listening is purely for tesing locally, as AWS Lambda handles the entry point for our requests
	.listen(port, async () => {
		console.log(`Server started - Listening on PORT: ${port}`);
	});

// The API Gateway expects responses to look a certain way
// EX:
// return {
// 	statusCode: 200/300/400/500,
// 	body: {
// 		data: YOUR DATA HERE
// 	}
// }
//
// So in our routes we set the ctx.body = the above
// which will auto return the response
module.exports.handler = bugsnagHandler(
	ServerlessHttp(server, {
		provider: 'aws'
	})
);
