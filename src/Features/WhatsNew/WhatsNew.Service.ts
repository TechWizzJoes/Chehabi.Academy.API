import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { WhatsNewRepository } from './WhatsNew.Repository';
import { WhatsNewModels } from './WhatsNew.Models';
import { promises } from 'dns';

@Injectable()
export class WhatsNewService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private WhatsNewRepository: WhatsNewRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<WhatsNewModels.MasterModel> {
		return await this.WhatsNewRepository.GetById(id);
	}

	async Getall(): Promise<WhatsNewModels.MasterModel[]> {
		return this.WhatsNewRepository.GetAll();
	}
	async Create(whatsNew: WhatsNewModels.WhatsNewReqModel): Promise<WhatsNewModels.MasterModel> {
		return await this.WhatsNewRepository.Create(whatsNew);
	}

	async Update(id, whatsNew: WhatsNewModels.WhatsNewReqModel): Promise<WhatsNewModels.MasterModel> {
		return await this.WhatsNewRepository.Update(id, whatsNew);
	}
	async Delete(id): Promise<WhatsNewModels.MasterModel> {
		return await this.WhatsNewRepository.Delete(id);
	}
}
