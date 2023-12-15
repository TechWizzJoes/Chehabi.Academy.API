import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { UserRepository } from './User.Repository';
import { UserModels } from './User.Models';
import { promises } from 'dns';

@Injectable()
export class UserService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private UserRepository: UserRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id: number): Promise<UserModels.MasterModel> {
		return this.UserRepository.GetById(id);
	}

	SaveUser(user: UserModels.MasterModel) {
		return this.UserRepository.SaveUser(user);
	}

	GetClassesInfo() {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		return this.UserRepository.GetClassesInfo(CurrentUser.UserId);
	}
}
