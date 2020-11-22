import HttpStatusCode from '../utils/HttpStatusCode';

class RuntimeError extends Error {
	statusCode: HttpStatusCode;
	message: string;

	constructor(statusCode: HttpStatusCode, message: string) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

export default RuntimeError;
