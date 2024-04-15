import Router from 'koa-router';
import { createApiKey } from '@src/controllers/auth/create-api-key';

const authRouter = new Router();

authRouter.post('/auth', (ctx) => createApiKey(ctx));

export default authRouter;
