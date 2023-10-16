import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@App/Config/App.Config';

@Controller('api')
export class AppController {
	constructor(private AppConfig: AppConfig) {}

	@Get()
	getHello() {
		const myconfig = this.AppConfig.Config;

		return 'Chehabi academy api Works!';

		//return myconfig;
	}

	@Get('/test')
	gettest() {
		return 'api is working!';
	}
}
