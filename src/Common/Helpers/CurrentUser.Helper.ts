import { HttpStatus, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AccountModels } from '../../Features/Account/Account.Models';
import { ApplicationException } from '../Exceptions/Application.Exception';
import { ErrorCodesEnum } from '../Enums/ErrorCodes.Enum';

@Injectable()
export class UserHelper {
	constructor(private readonly AsyncLocalStorage: AsyncLocalStorage<AccountModels.JwtModel>) {}

	GetCurrentUser() {
		return this.AsyncLocalStorage.getStore();
	}

	ValidateOwnerShip(createdBy: number) {
		const CurrentUser = this.GetCurrentUser();

		if (CurrentUser.UserId != createdBy)
			throw new ApplicationException(ErrorCodesEnum.USER_NOT_CREATOR, HttpStatus.FORBIDDEN);
	}
}
