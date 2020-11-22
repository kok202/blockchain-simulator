import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import blockchain from '../entity/Blockchain';

export const getAddressHandler = express.Router().get(
	'/address/:addressId',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		const address = request.params.addressId;
		const addressData = blockchain.getInformation(address);
		response.json({
			addressData: addressData,
		});
	}),
);
