import { AppConfig, Config } from '@App/Config/App.Config';
import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonModuleAsyncOptions } from 'nest-winston';
import * as winston from 'winston';
import { createLogger } from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserHelper } from '../Helpers/CurrentUser.Helper';

@Injectable()
export class WinstonService {
	private Config: Config;
	private InValidloginLogger: winston.Logger;
	private EndPointLogger: winston.Logger;
	private CustomLogger: winston.Logger;
	private DataBaseLogger: winston.Logger;
	constructor(
		@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: winston.Logger,
		private appConfig: AppConfig,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
		// adding extra loggers
		this.CreateLoggers();
	}

	CreateLoggers() {
		this.Loggers.InvalidLogin();
		this.Loggers.EndPoints();
		this.Loggers.Custom();
		this.Loggers.DataBase();
	}

	Loggers = {
		InvalidLogin: () => {
			this.InValidloginLogger = createLogger({
				level: 'error',
				format: customFormatter,
				transports: [
					new DailyRotateFile({
						filename: `${this.Config.StorageFolder}/Logs/InvalidLogins/%DATE%.log`,
						datePattern: 'YYYY-MM-DD',
						utc: true
					})
				]
			});
		},
		EndPoints: () => {
			this.EndPointLogger = createLogger({
				level: 'info',
				format: customFormatter,
				transports: [
					new DailyRotateFile({
						filename: `${this.Config.StorageFolder}/Logs/EndPoints/%DATE%.log`,
						datePattern: 'YYYY-MM-DD',
						utc: true
					})
				]
			});
		},
		Custom: () => {
			this.CustomLogger = createLogger({
				level: 'info',
				format: customFormatter,
				transports: [
					new DailyRotateFile({
						filename: `${this.Config.StorageFolder}/Logs/Custom/%DATE%.log`,
						datePattern: 'YYYY-MM-DD',
						utc: true
					})
				]
			});
		},
		DataBase: () => {
			this.DataBaseLogger = createLogger({
				level: 'info',
				format: customFormatter,
				transports: [
					new DailyRotateFile({
						filename: `${this.Config.StorageFolder}/Logs/DataBase/%DATE%.log`,
						datePattern: 'YYYY-MM-DD',
						utc: true
					})
				]
			});
		}
	};

	LoginError(request: any, startTime: number, message: string, trace?: string, context?: string) {
		return new Promise((resolve, reject) => {
			this.InValidloginLogger.error({
				LogToken: request.headers['log-token'],
				EndpointUrl: request.url,
				Method: request.method,
				RemoteIp: request.connection.remoteAddress,
				Start: this.ParseDate(startTime),
				End: this.ParseDate(),
				Time: `${Date.now() - startTime}`,
				Error: message
			});
		});
	}

	EndPoint(request: any, trace?: string, context?: string) {
		return new Promise((resolve, reject) => {
			this.EndPointLogger.info({
				LogToken: request.headers['log-token'],
				EndpointUrl: request.url,
				Method: request.method,
				RemoteIp: request.connection.remoteAddress,
				UserId: request.user?.UserId, // ? due to no user in login needs to be removed after account api login
				Start: this.ParseDate(request.StartTime),
				End: this.ParseDate(),
				Time: `${Date.now() - request.StartTime}`
			});
		});
	}

	Exceptions(request: any, startTime: number, message: string, trace?: string, context?: string) {
		this.logger.error({
			LogToken: request.headers['log-token'],
			EndpointUrl: request.url,
			Method: request.method,
			RemoteIp: request.connection.remoteAddress,
			UserId: request.user?.UserId, // ? due to no user in login needs to be removed after account api login
			Start: this.ParseDate(startTime),
			End: this.ParseDate(),
			Time: `${Date.now() - startTime}`,
			Error: message
		});
	}

	Custom(request: any, message: any, trace?: string, context?: string) {
		return new Promise((resolve, reject) => {
			this.CustomLogger.info({
				LogToken: request.headers['log-token'],
				EndpointUrl: request.url,
				Method: request.method,
				RemoteIp: request.connection.remoteAddress,
				Message: { ...message },
				Start: this.ParseDate(request.StartTime),
				End: this.ParseDate(),
				Time: `${Date.now() - request.StartTime}`
			});
		});
	}

	DataBase(message: string, time, trace?: string, context?: string) {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		this.DataBaseLogger.info({
			UserId: CurrentUser.UserId,
			Query: message,
			Time: time
		});
	}

	ParseDate(time?: number): string {
		time = time ?? Date.now();
		const parsedDate = new Date(time).toISOString().replace(/T/, ' ').replace(/Z/, '');
		return parsedDate;
	}
}

export const WinstonOptions: WinstonModuleAsyncOptions = {
	imports: [ConfigModule],
	useFactory: async (configService: ConfigService) => {
		const Config = configService.get<Config>('Config');
		return {
			format: customFormatter,
			transports: [
				// all errors
				new DailyRotateFile({
					level: 'error',
					dirname: `${Config.StorageFolder}/Logs/Exceptions`,
					filename: `%DATE%.log`,
					datePattern: 'YYYY-MM-DD',
					utc: true
				})
			]
		};
	},
	inject: [ConfigService]
};
export const customFormatter = winston.format.printf((info) => {
	const { message, ...rest } = info;
	const logMessage = {
		...message
	};
	return JSON.stringify(logMessage);
});
