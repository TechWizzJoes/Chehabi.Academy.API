import { HttpException, HttpStatus } from '@nestjs/common';

export class LoginException extends HttpException {
	constructor(message) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
