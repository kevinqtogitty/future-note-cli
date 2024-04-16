interface Notification {
	id: string;
	alert: string;
	message: string;
	date: string;
	isSent: boolean;
	createdAt: number;
	isDeleted: boolean;
}

interface NotificationRequest {
	alert: string;
	message: string;
	date: string;
}

export { Notification, NotificationRequest };
