import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
	Env: process.env.ENV,
	StorageFolder: process.env.STORAGE_FOLDER,
	VoicemailStorageFolder: process.env.VOICEMAIL_FOLDER_PATH,
	FrontendUrl: process.env.FRONTEND_URL,
	Server: {
		Host: process.env.SERVER_HOST,
		Port: parseInt(process.env.SERVER_PORT, 10)
	},
	Database: {
		Mother: {
			Host: process.env.DATABASE_MOTHER_HOST,
			Username: process.env.DATABASE_MOTHER_USERNAME,
			Password: process.env.DATABASE_MOTHER_PASSWORD,
			Name: process.env.DATABASE_MOTHER_NAME,
			Min: parseInt(process.env.DATABASE_POOL_MIN, 10),
			Max: parseInt(process.env.DATABASE_POOL_MAX, 10),
			Idle: parseInt(process.env.DATABASE_POOL_IDLE, 10)
		},
		Client: {
			Host: process.env.DATABASE_CLIENT_HOST,
			Port: parseInt(process.env.DATABASE_CLIENT_PORT, 10),
			Username: process.env.DATABASE_CLIENT_USERNAME,
			Password: process.env.DATABASE_CLIENT_PASSWORD,
			Asterisk: process.env.DATABASE_CLIENT_ASTERISK,
			Dialer: process.env.DATABASE_CLIENT_DIALER,
			Min: parseInt(process.env.DATABASE_POOL_MIN, 10),
			Max: parseInt(process.env.DATABASE_POOL_MAX, 10),
			Idle: parseInt(process.env.DATABASE_POOL_IDLE, 10)
		}
	},
	Auth: {
		EncryptionKey: process.env.AUTH_ENCRYPTION_KEY,
		Jwt: {
			Key: process.env.AUTH_JWT_KEY,
			Lifespan: process.env.AUTH_JWT_LIFESPAN,
			Issuer: process.env.AUTH_JWT_ISSUER,
			Audience: process.env.AUTH_JWT_AUDIENCE
		},
		EmailConfirmation: {
			Key: process.env.AUTH_EMAILCONFIRMATION_KEY,
			Lifespan: parseInt(process.env.AUTH_EMAILCONFIRMATION_LIFESPAN, 10)
		},
		PasswordReset: {
			Key: process.env.AUTH_PASSWORDRESET_KEY,
			Lifespan: parseInt(process.env.AUTH_PASSWORDRESET_LIFESPAN, 10)
		}
	},
	Bandwidth: {
		UserID: process.env.BANDWIDTH_USER_ID,
		ApplicationID: process.env.BANDWIDTH_APPLICATION_ID,
		Token: process.env.BANDWIDTH_TOKEN,
		Secret: process.env.BANDWIDTH_SECRET
	}
}));
