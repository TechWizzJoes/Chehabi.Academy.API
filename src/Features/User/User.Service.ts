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
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@App/Common/Events/Events';

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

	// async GetById(id: number): Promise<UserModels.MasterModel> {
	// 	return this.UserRepository.GetById(id);
	// }

	async GetProfileInfo(): Promise<UserModels.MasterModel> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		return this.UserRepository.GetById(CurrentUser.UserId);
	}

	async GetInstructorByUserId(id: number): Promise<InstructorModels.MasterModel> {
		return this.InstructorRepository.GetByUserId(id);
	}

	GetUsersByClassId(classId: number): Promise<UserModels.UserClass[]> {
		return this.UserRepository.GetUsersByClassId(classId);
	}

	UpdateUser(user: UserModels.UserReqModel) {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		// avoid changing mail fraud
		user.Email = CurrentUser.Email;
		return this.UserRepository.UpdateUser(user);
	}

	async Upload(filePath: string): Promise<{}> {
		return { filePath };
	}

	async AddUserToClass(userId: number, classId: number, IsPaid: boolean): Promise<UserModels.UserClass> {
		return this.UserRepository.AddUserToClass(userId, classId, IsPaid);
	}

	async CreateUserPreference(userId: number) {
		return this.UserRepository.CreateUserPreference(userId);
	}

	async UpdateUserPreference(userPreference: UserModels.UserPrefrenceReqModel) {
		const CurrentUser = this.UserHelper.ValidateOwnerShip(userPreference.UserId);
		return this.UserRepository.UpdateUserPreference(userPreference);
	}

	@OnEvent(Events.USER_CREATED)
	handleEvent(user: UserModels.MasterModel) {
		this.CreateUserPreference(user.Id);
	}
}
