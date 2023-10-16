import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Configuration from '@App/Config/Configuration';

export interface Config {
	Env: string;
	StorageFolder: string;
	VoicemailStorageFolder: string;
	FrontendUrl: string;
	Server: {
		Host: string;
		Port: number;
	};
	Database: {
		Mother: {
			Host: string;
			Username: string;
			Password: string;
			Name: string;
			Min: number;
			Max: number;
			Idle: number;
		};
		Client: {
			Host: string;
			Port: number;
			Username: string;
			Password: string;
			Asterisk: string;
			Dialer: string;
			Min: number;
			Max: number;
			Idle: number;
		};
	};
	Auth: {
		EncryptionKey: string;
		Jwt: {
			Key: string;
			Lifespan: string;
			Issuer: string;
			Audience: string;
		};
		EmailConfirmation: {
			Key: string;
			Lifespan: number;
		};
		PasswordReset: {
			Key: string;
			Lifespan: number;
		};
	};
}

@Injectable()
export class AppConfig {
	constructor(
		@Inject(Configuration.KEY)
		public Config: ConfigType<typeof Configuration>
	) {}
}
