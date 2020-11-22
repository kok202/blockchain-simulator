import { Type } from 'class-transformer';
import sha256 from 'sha256';
import Constants from '../utils/Constants';
import Transaction from './Transaction';
import 'reflect-metadata';

export default class Block {
	@Type(() => Transaction)
	private minedBy?: Transaction;
	private height: number;
	@Type(() => Transaction)
	private transactions: Transaction[];
	private nonce: number;
	private hash: string;
	private previousBlockHash: string;
	private timestamp: number;

	constructor(previousBlock?: Block | null, transactions?: Transaction[]) {
		if (!previousBlock) {
			this.height = Constants.GENESIS_BLOCK_HEIGHT;
			this.nonce = Constants.GENESIS_BLOCK_NONCE;
			this.previousBlockHash = Constants.GENESIS_BLOCK_PREVIOUS_BLOCK_HASH;
			this.hash = Constants.GENESIS_BLOCK_HASH;
		} else {
			this.height = previousBlock.height + 1;
			this.nonce = 0;
			this.previousBlockHash = previousBlock.hash;
			this.hash = '';
			this.minedBy = new Transaction(
				Constants.REWARD,
				Constants.ROOT_ADDRESS,
				Constants.NODE_ADDRESS,
			);
		}
		this.transactions = transactions || [];
		this.timestamp = Date.now();
	}

	public isGensisBlock() {
		return (
			this.nonce === Constants.GENESIS_BLOCK_NONCE &&
			this.previousBlockHash === Constants.GENESIS_BLOCK_PREVIOUS_BLOCK_HASH &&
			this.hash === Constants.GENESIS_BLOCK_HASH &&
			this.transactions.length === 0
		);
	}

	public isAppendable(nextBlock: Block) {
		return this.hash === nextBlock.previousBlockHash && this.height + 1 === nextBlock.height;
	}

	public getHeight() {
		return this.height;
	}

	public getTransactions() {
		return this.minedBy ? [this.minedBy, ...this.transactions] : this.transactions;
	}

	public getHash() {
		return this.hash;
	}

	public getPreviousBlockHash() {
		return this.previousBlockHash;
	}

	public setHash(hash: string) {
		this.hash = hash;
	}

	public setNonce(nonce: number) {
		this.nonce = nonce;
	}

	public proofOfWork() {
		return sha256(
			JSON.stringify({
				height: this.height,
				transactions: this.transactions,
				nonce: this.nonce,
				previousBlockHash: this.previousBlockHash,
				minedBy: this.minedBy,
			}),
		);
	}
}
