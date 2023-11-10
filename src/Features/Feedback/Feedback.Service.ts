import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { FeedbackRepository } from './Feedback.Repository';
import { FeedbackModels } from './Feedback.Models';
import { promises } from 'dns';

@Injectable()
export class FeedbackService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private FeedbackRepository: FeedbackRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackRepository.GetById(id);
	}

	async Getall(): Promise<FeedbackModels.MasterModel[]> {
		return this.FeedbackRepository.Getall();
	}
	async Create(course: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		return await this.FeedbackRepository.Create(course);
	}

	async Update(id, course: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		return await this.FeedbackRepository.Update(id, course);
	}
	async Delete(id): Promise<FeedbackModels.MasterModel> {
		return await this.FeedbackRepository.Delete(id);
	}
}
