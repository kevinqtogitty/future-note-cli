interface Message {
	id: string;
	message: string;
	date: number;
	isSent: boolean;
	createdAt: number;
	isDeleted: boolean;
	type: string;
	phoneNumber: number;
}

interface MessageRequest {
	message: string;
	date: number;
	phoneNumber: number;
}

export { Message, MessageRequest };
