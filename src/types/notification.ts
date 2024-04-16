interface Notification {
	id: string;
	alert: string;
	message: string;
	date: number;
	isSent: boolean;
	createdAt: number;
	isDeleted: boolean;
	type: string;
}

interface NotificationRequest {
	alert: string;
	message: string;
	date: number;
}

export { Notification, NotificationRequest };
