import Router from 'koa-router';
import {
	fetchAllNotifications,
	fetchSingleNotification,
	postSingleNotification
} from '@src/controllers/notification/consolidated';

const notificationRouter = new Router();

notificationRouter
	.get('/notification', (ctx) => fetchAllNotifications(ctx))
	.get('/notification/:id', (ctx) => fetchSingleNotification(ctx))
	.post('/notification/:id', (ctx) => postSingleNotification(ctx));

export default notificationRouter;
