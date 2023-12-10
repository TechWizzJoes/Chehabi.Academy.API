import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	UnauthorizedException
} from '@nestjs/common';
import sequelize, { ConnectionError, TimeoutError } from 'sequelize';

import { WinstonService } from '@App/Common/Logs/Winston.Helper';
import { AccountException } from '../Exceptions/Account.Exception';
import { ExceptionResult } from '../Exceptions/Result.Exception';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	logError: boolean = true;
	constructor(private readonly WinstonService: WinstonService) {}

	catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse();
		const request = host.switchToHttp().getRequest();
		const message = exception.message;
		const startTime = request.StartTime ?? Date.now();

		console.log(exception.name, '\n', exception);
		if (exception instanceof AccountException) {
			const statusCode = exception.getStatus();
			this.WinstonService.LoginError(request, startTime, message);

			response.status(statusCode).json(exception.getResponse());
		} else if (exception instanceof UnauthorizedException) {
			const statusCode = exception.getStatus();
			this.WinstonService.LoginError(request, startTime, message);

			response.status(statusCode).json(exception.getResponse());
		}

		if (this.logError) {
			// log any error other than login errors and database specified errors
			this.WinstonService.Exceptions(request, startTime, message);
		}

		response.status(500).json(new ExceptionResult('global handler' + exception.name, message, 500));
		// response.status(500).json({
		// 	message: 'Internal server error.'
		// });
	}
}
