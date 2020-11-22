import { v4 as uuid } from 'uuid';

export default class Transaction {
	private id: string;
	private amount: number;
	private sender: string;
	private recipient: string;

	constructor(amount: number, sender: string, recipient: string) {
		this.id = uuid().replace(/-/gi, '');
		this.amount = amount;
		this.sender = sender;
		this.recipient = recipient;
	}

	public isEqual(id: string) {
		return this.id === id;
	}

	public getId() {
		return this.id;
	}

	public getAmount() {
		return this.amount;
	}

	public getSender() {
		return this.sender;
	}

	public getRecipient() {
		return this.recipient;
	}

	public isRelatedWith(address: string) {
		return this.sender === address || this.recipient === address;
	}
}
