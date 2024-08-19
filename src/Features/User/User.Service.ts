import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { UserRepository } from './User.Repository';
import { UserModels } from './User.Models';
import { InstructorRepository } from './Instructor.Repository';
import { InstructorModels } from './Instructor.Models';

@Injectable()
export class UserService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private UserRepository: UserRepository,
		private InstructorRepository: InstructorRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id: number): Promise<UserModels.MasterModel> {
		return this.UserRepository.GetById(id);
	}

	async GetInstructorByUserId(id: number): Promise<InstructorModels.MasterModel> {
		return this.InstructorRepository.GetByUserId(id);
	}

	UpdateUser(user: UserModels.UserResModel) {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		// avoid changing mail fraud
		user.Email = CurrentUser.Email;
		return this.UserRepository.UpdateUser(user);
	}

	async Upload(filePath: string): Promise<{}> {
		return { filePath };
	}
}
