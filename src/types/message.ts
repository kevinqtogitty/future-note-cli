interface Message {
	id: string;
	message: string;
	date: number;
	isSent: boolean;
	createdAt: number;
	isDeleted: boolean;
	type: string;
}

interface MessageRequest {
	message: string;
	date: number;
}

export { Message, MessageRequest };
