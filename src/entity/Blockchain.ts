import Block from './Block';
import Transaction from './Transaction';
import Constants from '../utils/Constants';
import { Type } from 'class-transformer';
import 'reflect-metadata';

export class Blockchain {
	@Type(() => Block)
	private chain: Block[];
	@Type(() => Transaction)
	private pendingTransactions: Transaction[];
	private currentNodeUrl: string;
	private networkNodeUrls: string[];

	constructor() {
		this.chain = [];
		this.pendingTransactions = [];
		this.currentNodeUrl = process.argv[3];
		this.networkNodeUrls = [];
		this.createGenesisBlock();
	}

	private createGenesisBlock() {
		const genesisBlock = new Block(null, this.pendingTransactions);
		this.acceptBlock(genesisBlock);
	}

	public createNewTransaction(amount: number, sender: string, recipient: string) {
		return new Transaction(amount, sender, recipient);
	}

	public mining(currentBlock: Block) {
		const block = currentBlock;
		for (
			let nonce = 0, blockHash = block.proofOfWork();
			blockHash.substring(0, Constants.PROOF_OF_WORK_LENGTH) !== Constants.PROOF_OF_WORK;
			nonce++
		) {
			block.setNonce(nonce);
			blockHash = block.proofOfWork();
		}
		block.setHash(block.proofOfWork());
		return block;
	}

	public isValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const current = this.chain[i];
			const previous = this.chain[i - 1];
			const isInvalid =
				current.proofOfWork().substring(0, Constants.PROOF_OF_WORK_LENGTH) !==
				Constants.PROOF_OF_WORK;
			if (isInvalid) return false;
			if (current.getPreviousBlockHash() !== previous.getHash()) return false;
		}
		if (!this.chain[0].isGensisBlock()) return false;
		return true;
	}

	public getChain() {
		return this.chain;
	}

	public getChainLevel() {
		return this.chain.length;
	}

	public getBlock(hash: string) {
		for (const block of this.chain) if (block.getHash() === hash) return block;
		return null;
	}

	public getLastBlock() {
		return this.chain[this.chain.length - 1];
	}

	public getTransaction(id: string) {
		for (const block of this.chain) {
			for (const transaction of block.getTransactions()) {
				if (transaction.isEqual(id))
					return {
						block: block,
						transaction: transaction,
					};
			}
		}
		return { block: null, transaction: null };
	}

	public getInformation(address: string) {
		const transactionsBuffer = new Map<string, Transaction>();
		this.chain
			.map(block => block.getTransactions())
			.reduce((accumulate, current) => accumulate.concat(current), [])
			.filter(transaction => transaction.isRelatedWith(address))
			.forEach(transaction => transactionsBuffer.set(transaction.getId(), transaction));
		const addressTransactions = Array.from(transactionsBuffer.values());

		let addressBalance = 0;
		addressTransactions.forEach(transaction => {
			if (transaction.getRecipient() === address) addressBalance += transaction.getAmount();
			else if (transaction.getSender() === address) addressBalance -= transaction.getAmount();
		});

		return {
			addressTransactions: addressTransactions,
			addressBalance: addressBalance,
		};
	}

	public acceptBlock(block: Block) {
		this.chain.push(block);
		this.clearPendingTransactions();
		return this.chain.push();
	}

	public receiveBlock(block: Block) {
		this.chain.push(block);
		this.clearPendingTransactions();
		return this.chain.push();
	}

	public getPendingTransactions() {
		return this.pendingTransactions;
	}

	public addTransactionToPending(transaction: Transaction) {
		this.pendingTransactions.push(transaction);
		return this.getLastBlock().getHeight() + 1;
	}

	public clearPendingTransactions() {
		this.pendingTransactions = [];
		return this.pendingTransactions;
	}

	public getNetworkNodeUrls() {
		return this.networkNodeUrls;
	}

	public addNetworkNodeUrl(nodeUrl: string) {
		this.networkNodeUrls.push(nodeUrl);
	}

	public getCurrentNodeUrl() {
		return this.currentNodeUrl;
	}

	public isNetworkNodeExist(nodeUrl: string) {
		return this.networkNodeUrls.indexOf(nodeUrl) !== -1 || this.currentNodeUrl === nodeUrl;
	}

	public isCurrentNode(nodeUrl: string) {
		return this.currentNodeUrl === nodeUrl;
	}

	public overwrite(blockchain: Blockchain) {
		this.chain = blockchain.chain;
		this.pendingTransactions = blockchain.pendingTransactions;
	}
}

const blockchain = new Blockchain();
export default blockchain;
