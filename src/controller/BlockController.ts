import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import blockchain from '../entity/Blockchain';
import Block from '../entity/Block';
import { plainToClass } from 'class-transformer';

export const getBlockchain = express.Router().get(
	'/blockchain',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		response.send(blockchain);
	}),
);

export const getBlock = express.Router().get(
	'/blocks/:blockHash',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const blockHash = request.params.blockHash;
		const correctBlock = blockchain.getBlock(blockHash);
		response.json({ block: correctBlock });
	}),
);

export const receiveBlock = express.Router().post(
	'/blocks/receive',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const block = plainToClass(Block, request.body as Block);
		const lastBlock = blockchain.getLastBlock();
		if (lastBlock.isAppendable(block)) {
			blockchain.receiveBlock(block);
			response.json({
				note: 'New block received and accepted.',
				block: block,
			});
		} else {
			response.json({
				note: 'New block rejected.',
				block: block,
			});
		}
	}),
);
