import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Configuration from '@App/Config/Configuration';

export interface Config {
	Env: string;
	Server: {
		Host: string;
		Port: number;
	};
	Database: {
		Host: string;
		Name: string;
		Username: string;
		Password: string;
		Min: number;
		Max: number;
		Idle: number;
	};
	StorageFolder: string;
	Auth: {
		EncryptionKey: string;
		Jwt: {
			Key: string;
			Lifespan: string;
			RefreshTokenSpan: string;
			Issuer: string;
			Audience: string;
		};
	};
}

@Injectable()
export class AppConfig {
	constructor(
		@Inject(Configuration.KEY)
		public Config: ConfigType<typeof Configuration>
	) { }
}
