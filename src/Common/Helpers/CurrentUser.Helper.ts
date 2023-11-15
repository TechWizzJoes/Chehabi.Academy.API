import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AccountModels } from '../../Features/Account/Account.Models';

@Injectable()
export class UserHelper {
	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<AccountModels.JwtModel>) {}

	GetCurrentUser() {
		return this.AsyncLocalStorage.getStore();
	}
}
