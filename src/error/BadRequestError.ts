import HttpStatusCode from '../utils/HttpStatusCode';
import RuntimeError from './RuntimeError';

class BadRequestError extends RuntimeError {
	constructor(message: string) {
		super(HttpStatusCode.BAD_REQUEST, message);
	}
}
export default BadRequestError;
