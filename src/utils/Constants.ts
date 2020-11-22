import { v4 as uuid } from 'uuid';

export default class Constants {
	static readonly REWARD = 12.5;
	static readonly ROOT_ADDRESS = '00';
	static readonly NODE_ADDRESS = uuid().replace(/-/gi, '');
	static readonly GENESIS_BLOCK_HEIGHT = 1;
	static readonly GENESIS_BLOCK_NONCE = 100;
	static readonly GENESIS_BLOCK_HASH = '0';
	static readonly GENESIS_BLOCK_PREVIOUS_BLOCK_HASH = '0';
	static readonly PROOF_OF_WORK_LENGTH = 4;
	static readonly PROOF_OF_WORK = '0000';
}
