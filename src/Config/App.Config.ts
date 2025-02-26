import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Configuration from '@App/Config/Configuration';

export interface Config {
	Env: string;
	Server: {
		Host: string;
		Port: number;
		FrontEndHost: string;
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
	CoursesStorageFolder: string;
	Auth: {
		EncryptionKey: string;
		Jwt: {
			Key: string;
			Lifespan: string;
			RefreshTokenSpan: string;
			Issuer: string;
			Audience: string;
		};
		Google: {
			ClientID: string;
		};
	};
	Notification?: {
		PublicKey: string;
		PrivateKey: string;
	};
	Stripe: {
		Secret: string;
		EndpointSecret: string;
	};
}

@Injectable()
export class AppConfig {
	constructor(
		@Inject(Configuration.KEY)
		public Config: ConfigType<typeof Configuration>
	) {}
}
