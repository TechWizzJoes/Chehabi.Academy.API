import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { APP_FILTER } from '@nestjs/core';

import { WinstonModule } from 'nest-winston';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './App.Controller';
import { AppConfig } from '@App/Config/App.Config';
import Configuration from '@App/Config/Configuration';

import { CurrentUserInterceptor } from '@App/Common/Interceptors/CurrentUser.Interceptor';
import { LoggingInterceptor } from '@App/Common/Interceptors/Logging.Interceptor';

import { GlobalExceptionFilter } from '@App/Common/Filters/GlobalException.Filter';
import { WinstonOptions } from '@App/Common/Logs/Winston.Helper';
import { CommonModule } from '@App/Common/Common.Module';
import { JwtOptions } from '@App/Common/Auth/Jwt.Helper';
import { JwtStrategy } from '@App/Common/Auth/Jwt.Strategy';
import { TypeOrmOptions } from '@App/Data/TypeOrmOptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '@App/Features/Account/Account.Module';
import { CoursesModule } from '@App/Features/Courses/Courses.Module';
import { ClassModule } from '@App/Features/Class/Class.Module';
import { FeedbackModule } from '@App/Features/Feedback/Feedback.Module';
import { RefreshJwtStrategy } from '@App/Common/Auth/RefreshToken-Strategy';
import { NotificationsModule } from '@App/Features/-Notifications/Notifications.Module';
import { EmailSenderModule } from '@App/Features/EmailSender/EmailSender.Module';
import { DatabaseExceptionFilter } from '@App/Common/Filters/DatabaseException.Filter';
import { ValidationExceptionFilter } from '@App/Common/Filters/ValidationException.Filter';
import { ApplicationExceptionFilter } from '@App/Common/Filters/ApplicationException.Filter';
import { WhatsNewModule } from '@App/Features/WhatsNew/WhatsNew.Module';
import { MulterModule } from '@nestjs/platform-express';
import { SessionModule } from '@App/Features/Session/Session.Module';

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [Configuration],
			isGlobal: true,
			cache: true // restart the app after changing Env variables
		}),
		WinstonModule.forRootAsync(WinstonOptions),
		{
			...JwtModule.registerAsync(JwtOptions),
			global: true // to register only once and be accessed across the whole app
		},
		TypeOrmModule.forRootAsync(TypeOrmOptions),
		CommonModule,
		AccountModule,
		CoursesModule,
		ClassModule,
		SessionModule,
		FeedbackModule,
		NotificationsModule,
		EmailSenderModule,
		WhatsNewModule
	],
	controllers: [AppController],
	providers: [
		AppConfig,
		JwtStrategy,
		RefreshJwtStrategy,
		{
			provide: APP_FILTER,
			useClass: GlobalExceptionFilter
		},
		{
			provide: APP_FILTER,
			useClass: DatabaseExceptionFilter
		},
		{
			provide: APP_FILTER,
			useClass: ApplicationExceptionFilter
		},
		{
			provide: APP_FILTER,
			useClass: ValidationExceptionFilter
		},
		{ provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
		{ provide: APP_INTERCEPTOR, useClass: CurrentUserInterceptor }
	]
})
export class AppModule {}
