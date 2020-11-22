import requestPromise from 'request-promise';

const loading = 5000;
const consensusPeriod = 1000;
const consensusNth = 200;
const miningNth = 100;
const networkNodes = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const activate = async () => {
	const requestPromises = networkNodes.map(networkNode => {
		console.log(`activate node to ${networkNode}.`);
		return requestPromise({
			uri: networkNode + '/node?method=bulk',
			method: 'POST',
			body: {
				networkNodes: networkNodes,
			},
			json: true,
		});
	});
	await Promise.all(requestPromises);
};

const consensus = async (i: number) => {
	const requestPromises = networkNodes.map(networkNode => {
		console.log(`${networkNode} - ${i} consensus.`);
		return requestPromise({
			uri: networkNode + '/consensus',
			method: 'POST',
		});
	});
	await Promise.all(requestPromises);
};

setTimeout(activate, loading);
setTimeout(async () => {
	const requestPromises = networkNodes.map(async networkNode => {
		for (let i = 0; i < miningNth; i++) {
			console.log(`${networkNode} - ${i}th mining.`);
			await requestPromise({
				uri: networkNode + '/mining',
				method: 'POST',
			});
		}
	});
	await Promise.all(requestPromises);
}, loading);
setTimeout(() => {
	for (let i = 0; i < consensusNth; i++) {
		setTimeout(() => consensus(i), i * consensusPeriod);
	}
}, loading);
