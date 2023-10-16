import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import sequelize, { ConnectionError, TimeoutError } from 'sequelize';

import { WinstonService } from '@App/Common/Logs/Winston.Helper';
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
		response.status(500).json({
			message: 'Internal server error.'
		});

		if (this.logError) {
			this.WinstonService.Exceptions(request, startTime, message);
		}
	}
}
