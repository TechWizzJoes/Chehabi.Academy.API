import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { WinstonService } from '@App/Common/Logs/Winston.Helper';
import { AccountException } from '../Exceptions/Account.Exception';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { ExceptionResult } from '../Exceptions/Result.Exception';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
	logError: boolean = true;
	constructor(private readonly WinstonService: WinstonService) {}

	catch(exception: TypeORMError, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse();
		const request = host.switchToHttp().getRequest();
		const message = exception.message;
		const statusCode = 500;
		const startTime = request.StartTime ?? Date.now();

		console.log(exception.name, '\n', exception);
		if (this.logError) {
			// log any error other than login errors and database specified errors
			this.WinstonService.Exceptions(request, startTime, message);
		}

		response.status(500).json(new ExceptionResult('DB' + exception.name, message, statusCode));
	}
}
