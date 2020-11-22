import { Blockchain } from '../entity/Blockchain';
import { plainToClass } from 'class-transformer';

const dummyBlockchain = plainToClass(Blockchain, {
	chain: [
		{
			height: 1,
			nonce: 100,
			previousBlockHash: '0',
			hash: '0',
			transactions: [],
			timestamp: 1605988032018,
		},
		{
			height: 2,
			nonce: 119306,
			previousBlockHash: '0',
			hash: '0000f820ba5196f2a5e33b154b34ddb6398da43f02867c9549142321fdee5446',
			minedBy: {
				id: '578c22ac99704935bf03c69c41e9ff58',
				amount: 12.5,
				sender: '00',
				recipient: '71f753aaa32049dd856a067af1e75b1b',
			},
			transactions: [],
			timestamp: 1605988047383,
		},
		{
			height: 3,
			nonce: 28965,
			previousBlockHash: '0000f820ba5196f2a5e33b154b34ddb6398da43f02867c9549142321fdee5446',
			hash: '0000505a8fbdac3fc7411556cd0d9d4d8741f28c7330a6509b517b77ae4f1468',
			minedBy: {
				id: '2fa8d1866abf451b814b36b871916c1a',
				amount: 12.5,
				sender: '00',
				recipient: '71f753aaa32049dd856a067af1e75b1b',
			},
			transactions: [],
			timestamp: 1605988051647,
		},
	],
	pendingTransactions: [],
	currentNodeUrl: '',
	networkNodes: [],
});
console.log('VALID: ', dummyBlockchain.isValid());
