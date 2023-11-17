import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionResult {
	constructor(public Type: string, public Message: string, public Code: number) {}
}
