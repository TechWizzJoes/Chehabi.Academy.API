import { HttpException, HttpStatus } from '@nestjs/common';

export class AccountException extends HttpException {
	constructor(message) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
