import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { WinstonService } from '@App/Common/Logs/Winston.Helper';
import { AccountException } from '../Exceptions/Account.Exception';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { ExceptionResult } from '../Exceptions/Result.Exception';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
	logError: boolean = false;
	constructor(private readonly WinstonService: WinstonService) {}

	catch(exception: BadRequestException, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse();
		const request = host.switchToHttp().getRequest();
		const message = exception.message;
		const statusCode = exception.getStatus();
		const startTime = request.StartTime ?? Date.now();

		console.log(exception.name, '\n', exception);
		if (this.logError) {
			// log any error other than login errors and database specified errors
			this.WinstonService.Exceptions(request, startTime, message);
		}

		response.status(500).json(new ExceptionResult('validation' + exception.name, message, statusCode));
	}
}
