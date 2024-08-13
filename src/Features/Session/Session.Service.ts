import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { SessionRepository } from './Session.Repository';
import { SessionModels } from './Session.Models';
import { promises } from 'dns';

@Injectable()
export class SessionService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private SessionRepository: SessionRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	// async GetById(id): Promise<SessionModels.MasterModel> {
	// 	return this.SessionRepository.GetById(id);
	// }

	async GetallByClassId(classId: number): Promise<SessionModels.MasterModel[]> {
		return this.SessionRepository.GetallByClassId(classId);
	}

	async Create(course: SessionModels.SessionReqModel): Promise<SessionModels.MasterModel> {
		return await this.SessionRepository.Create(course);
	}

	async Update(id, course: SessionModels.SessionReqModel): Promise<SessionModels.MasterModel> {
		return await this.SessionRepository.Update(id, course);
	}

	async Delete(id: number): Promise<void> {
		return await this.SessionRepository.Delete(id);
	}
}
