import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { UserModels } from '../Models/User.Models';

@Injectable()
export class UserHelper {
	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<UserModels.JwtModel>) {}

	GetCurrentUser() {
		return this.AsyncLocalStorage.getStore();
	}
}
