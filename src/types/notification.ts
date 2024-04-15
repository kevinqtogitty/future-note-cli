interface Notification {
	id: string;
	message: string;
	date: string;
	sent: boolean;
	createdAt: string;
	isDeleted: boolean;
}

export default Notification;
