import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import sequelize, { ConnectionError, TimeoutError } from 'sequelize';

import { WinstonService } from '@App/Common/Logs/Winston.Helper';
import { AccountException } from '../Exceptions/Account.Exception';
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	logError: boolean = true;
	constructor(private readonly WinstonService: WinstonService) {}

	catch(exception: any, host: ArgumentsHost) {
		const response = host.switchToHttp().getResponse();
		const request = host.switchToHttp().getRequest();
		const message = exception.message;
		const startTime = request.StartTime ?? Date.now();

		console.log(exception);
		if (exception instanceof AccountException) {
			const statusCode = exception.getStatus();
			this.WinstonService.LoginError(request, startTime, message);

			response.status(statusCode).json(exception.getResponse());
		} else {
			if (exception instanceof HttpException) {
				const statusCode = exception.getStatus();
				response.status(statusCode).json({ message: message });
			} else {
				console.log(exception);
				response.status(500).json({
					message: 'Internal server error.'
				});
			}
			if (this.logError) {
				// log any error other than login errors and database specified errors
				this.WinstonService.Exceptions(request, startTime, message);
			}
		}
	}
}
