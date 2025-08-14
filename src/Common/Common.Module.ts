import { Module } from '@nestjs/common';

import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { AsyncLocalStorage } from 'async_hooks';
import { WinstonService } from './Logs/Winston.Helper';
import { AppConfig } from '@App/Config/App.Config';
import { GetUserIfAnyGuard } from './Auth/GetUserIfAny.Guard';
import { GetUserIfAnyStrategy } from './Auth/GetUserIfAny-Strategy';

@Module({
	// imports: [AsyncLocalStorage, WinstonModule.forRoot(WinstonOptions)],
	imports: [AsyncLocalStorage],
	providers: [
		AppConfig,
		{
			provide: AsyncLocalStorage,
			useValue: new AsyncLocalStorage()
		},
		UserHelper,
		WinstonService,
		GetUserIfAnyStrategy
	],
	exports: [UserHelper, AsyncLocalStorage, WinstonService]
})
export class CommonModule { }
