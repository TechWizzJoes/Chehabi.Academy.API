import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { WinstonService } from '@App/Common/Logs/Winston.Helper';
import { ExceptionResult } from '../Exceptions/Result.Exception';
import { ApplicationException } from '../Exceptions/Application.Exception';

@Catch(ApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
	logError: boolean = true;
	constructor(private readonly WinstonService: WinstonService) {}

	catch(exception: ApplicationException, host: ArgumentsHost) {
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

		response.status(500).json(new ExceptionResult('app' + exception.name, message, statusCode));
	}
}
