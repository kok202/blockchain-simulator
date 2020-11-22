import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import blockchain from '../entity/Blockchain';
import requestPromise from 'request-promise';
import BadRequestError from '../error/BadRequestError';

export const registerNodeHandler = express.Router().post(
	'/node',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const method = request.query.method as 'withBroadcast' | 'bulk' | undefined;
		const networkNode = request.body.networkNode as string | undefined;
		const networkNodes = request.body.networkNodes as string[] | undefined;
		switch (method) {
			case 'withBroadcast':
				if (!networkNode) throw new BadRequestError('networkNode property is required/');
				if (blockchain.getNetworkNodeUrls().indexOf(networkNode) == -1)
					blockchain.addNetworkNodeUrl(networkNode);
				const regNodesPromises = blockchain.getNetworkNodeUrls().map(networkNodeUrl =>
					requestPromise({
						uri: networkNodeUrl + '/node',
						method: 'POST',
						body: { networkNode: networkNode },
						json: true,
					}),
				);
				await Promise.all(regNodesPromises);
				await requestPromise({
					uri: networkNode + '/node?method=bulk',
					method: 'POST',
					body: {
						networkNodes: [...blockchain.getNetworkNodeUrls(), blockchain.getCurrentNodeUrl()],
					},
					json: true,
				});
				response.json({ note: 'New node registered with network successfully.' });
				break;
			case 'bulk':
				if (!networkNodes) throw new BadRequestError('networkNodes property is required/');
				networkNodes.forEach(networkNodeUrl => {
					if (
						!blockchain.isNetworkNodeExist(networkNodeUrl) &&
						!blockchain.isCurrentNode(networkNodeUrl)
					)
						blockchain.addNetworkNodeUrl(networkNodeUrl);
				});
				response.json({ note: 'Bulk registration successful.' });
				break;
			default:
				if (!networkNode) throw new BadRequestError('networkNode property is required/');
				if (!blockchain.isNetworkNodeExist(networkNode) && !blockchain.isCurrentNode(networkNode))
					blockchain.addNetworkNodeUrl(networkNode);
				response.json({ note: 'New node registered successfully.' });
				break;
		}
	}),
);
