import { registerAs } from '@nestjs/config';

export default registerAs('Config', () => ({
	Env: process.env.ENV,
	Server: {
		Host: process.env.SERVER_HOST,
		Port: parseInt(process.env.SERVER_PORT, 10)
	},
	Database: {
		Host: process.env.DATABASE_HOSTT,
		Name: process.env.DATABASE_NAME,
		Username: process.env.DATABASE_USERNAMEE,
		Password: process.env.DATABASE_PASSWORDD,
		Min: parseInt(process.env.DATABASE_POOL_MIN, 10),
		Max: parseInt(process.env.DATABASE_POOL_MAX, 10),
		Idle: parseInt(process.env.DATABASE_POOL_IDLE, 10)
	},
	StorageFolder: process.env.STORAGE_FOLDER,
	Auth: {
		EncryptionKey: process.env.AUTH_ENCRYPTION_KEY,
		Jwt: {
			Key: process.env.AUTH_JWT_KEY,
			Lifespan: process.env.AUTH_ACCESS_TOKEN_LIFESPAN,
			Issuer: process.env.AUTH_JWT_ISSUER,
			Audience: process.env.AUTH_JWT_AUDIENCE,
			RefreshTokenSpan: process.env.AUTH_REFRESH_TOKEN_LIFESPAN
		},
		Google: {
			ClientID: process.env.AUTH_GOOGLE_CLIENT_ID
		}
	},
	Notification: {
		PublicKey: process.env.NOTIFICATION_PUBLIC_KEY,
		PrivateKey: process.env.NOTIFICATION_PRIVATE_KEY
	},
	Stripe: {
		Secret: process.env.STRIPE_SECRET,
		EndpointSecret: process.env.STRIPE_ENDPOINT_SECRET
	}
}));
