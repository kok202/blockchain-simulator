import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as ActionController from './controller/ActionController';
import * as AddressController from './controller/AddressController';
import * as BlockController from './controller/BlockController';
import * as ExplorerController from './controller/ExplorerController';
import * as NodeController from './controller/NodeController';
import * as TransactionController from './controller/TransactionController';
import swaggerConfig from './config/swagger.json';

const port = Number(process.argv[2]) || 3000;
const application = express();
application.use(cors());
application.use(express.json());
application.use(express.urlencoded({ extended: true }));

application.use(ActionController.mineHandler);
application.use(ActionController.consensusHandler);
application.use(AddressController.getAddressHandler);
application.use(BlockController.getBlock);
application.use(BlockController.getBlockchain);
application.use(BlockController.receiveBlock);
application.use(NodeController.registerNodeHandler);
application.use(TransactionController.createTransactionHandler);
application.use(TransactionController.getTransactionHandler);
application.use(ExplorerController.explorerHandler);

application.listen(port, () => {
	console.log(`listening on port ${port}!`);
});
application.use('/', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
