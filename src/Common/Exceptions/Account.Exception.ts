import { HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationException } from './Application.Exception';

export class AccountException extends ApplicationException {
	constructor(message) {
		super(message, HttpStatus.BAD_REQUEST);
	}
}
