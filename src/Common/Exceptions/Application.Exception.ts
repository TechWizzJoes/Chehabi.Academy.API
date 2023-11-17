import { HttpException, HttpStatus } from '@nestjs/common';

export class ApplicationException extends HttpException {
	constructor(message, status) {
		super(message, status);
	}
}
