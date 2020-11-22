import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import blockchain from '../entity/Blockchain';
import requestPromise from 'request-promise';

export const createTransactionHandler = express.Router().post(
	'/transactions',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const method = request.query.method as 'withBroadcast' | undefined;
		const transaction = blockchain.createNewTransaction(
			request.body.amount,
			request.body.sender,
			request.body.recipient,
		);
		switch (method) {
			case 'withBroadcast':
				blockchain.addTransactionToPending(transaction);
				const requestPromises = blockchain.getNetworkNodeUrls().map(networkNodeUrl => {
					return requestPromise({
						uri: networkNodeUrl + '/transactions',
						method: 'POST',
						body: transaction,
						json: true,
					});
				});
				await Promise.all(requestPromises);
				response.json({ note: 'Transaction created and broadcast successfully.' });
				break;
			default:
				const blockHeight = blockchain.addTransactionToPending(transaction);
				response.json({ note: `Transaction will be added in block ${blockHeight}.` });
				break;
		}
	}),
);

export const getTransactionHandler = express.Router().get(
	'/transactions/:transactionId',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const transactionId = request.params.transactionId;
		const trasactionData = blockchain.getTransaction(transactionId);
		response.json({
			transaction: trasactionData.transaction,
			block: trasactionData.block,
		});
	}),
);
