import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { LiveSessionRepository } from './Session.Repository';
import { LiveSessionModels } from './Session.Models';
import { promises } from 'dns';

@Injectable()
export class SessionService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private LiveSessionRepository: LiveSessionRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	// async GetById(id): Promise<SessionModels.MasterModel> {
	// 	return this.LiveSessionRepository.GetById(id);
	// }

	async GetallByClassId(classId: number): Promise<LiveSessionModels.MasterModel[]> {
		return this.LiveSessionRepository.GetallByClassId(classId);
	}

	async Create(course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Create(course);
	}

	async BulkCreate(sessions: LiveSessionModels.SessionReqModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkCreate(sessions);
	}

	async Update(id, course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Update(id, course);
	}

	async BulkUpdate(sessions: LiveSessionModels.MasterModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkUpdate(sessions);
	}

	async Delete(id: number): Promise<void> {
		return await this.LiveSessionRepository.Delete(id);
	}
}
