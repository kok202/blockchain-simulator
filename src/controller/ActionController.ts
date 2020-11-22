import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import blockchain, { Blockchain } from '../entity/Blockchain';
import requestPromise from 'request-promise';
import Block from '../entity/Block';
import { plainToClass } from 'class-transformer';

export const mineHandler = express.Router().post(
	'/mining',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		let newBlock = new Block(blockchain.getLastBlock(), blockchain.getPendingTransactions());
		newBlock = blockchain.mining(newBlock);
		blockchain.acceptBlock(newBlock);

		const requestPromises = blockchain.getNetworkNodeUrls().map(networkNodeUrl =>
			requestPromise({
				uri: networkNodeUrl + '/blocks/receive',
				method: 'POST',
				body: newBlock,
				json: true,
			}),
		);

		await Promise.all(requestPromises);
		response.json({
			note: 'New block mined & broadcast successfully',
			block: newBlock,
		});
	}),
);

export const consensusHandler = express.Router().post(
	'/consensus',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		// Collect all blockchains of the other node.
		const requestPromises = blockchain.getNetworkNodeUrls().map(networkNodeUrl =>
			requestPromise({
				uri: networkNodeUrl + '/blockchain',
				method: 'GET',
				json: true,
			}),
		);

		// Race the chain length with my blockchain.
		const apiResponses = await Promise.all(requestPromises);
		const blockchains = plainToClass(Blockchain, apiResponses);
		let maxChainLength = blockchain.getChainLevel();
		let longestBlockchain: Blockchain | null = null;
		for (const blockchain of blockchains) {
			if (blockchain.getChainLevel() > maxChainLength) {
				maxChainLength = blockchain.getChainLevel();
				longestBlockchain = blockchain;
			}
		}

		if (longestBlockchain && longestBlockchain.isValid()) {
			blockchain.overwrite(longestBlockchain);
			response.json({
				note: 'This chain has been replaced.',
				chain: blockchain.getChain(),
			});
		} else {
			response.json({
				note: 'Current chain has not been replaced.',
				chain: blockchain.getChain(),
			});
		}
	}),
);
