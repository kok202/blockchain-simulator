import * as express from 'express';
import handlerWrapper from '../utils/HandlerWrapper';
import path from 'path';

export const explorerHandler = express.Router().get(
	'/explorer',
	handlerWrapper(async (request: express.Request, response: express.Response) => {
		response.sendFile(path.resolve('src/view/explorer.html'));
	}),
);
