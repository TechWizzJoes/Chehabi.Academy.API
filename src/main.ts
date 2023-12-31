import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@App/Base/App.Module';
import { Config } from '@App/Config/App.Config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as compression from 'compression';

async function bootstrap() {
	// SSL/TLS Certificate
	let httpsOptions = null;
	if (process.env.NODE_ENV === 'production') {
		console.log('App is running in production mode');
		httpsOptions = {
			key: fs.readFileSync('/etc/pki/tls/private/teleplus.key', 'utf8'),
			cert: fs.readFileSync('/etc/pki/tls/certs/teleplus.crt', 'utf8')
		};
	}

	const app = await NestFactory.create(AppModule, {
		httpsOptions
	});
	app.setGlobalPrefix('api');

	// Handle unhandled promise rejections globally
	process.on('unhandledRejection', (reason, promise) => {
		console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	});

	const configService = app.get(ConfigService);
	const config = configService.get<Config>('Config');

	// Swagger
	const swaggerConfig = new DocumentBuilder()
		.setTitle('Chehabi Academy Api')
		.setDescription('The Chehabi Academy API documentation')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document: any = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('swagger', app, document);
	// app.use(SwaggerSecurity());

	// CORS
	app.enableCors({
		origin: '*'
	});

	// Gzip compression
	app.use(compression());

	await app.listen(config.Server.Port).then(async () => {
		const url = await app.getUrl();
		console.log(`ENV= ${config.Env}`);
		console.log(`Server  running on ${url}`);
		console.log(`Swagger running on ${url}/swagger`);
	});
}
bootstrap();
