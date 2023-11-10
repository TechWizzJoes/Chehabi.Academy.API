import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { ClassRepository } from './Class.Repository';
import { ClassModels } from './Class.Models';
import { promises } from 'dns';

@Injectable()
export class ClassService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private ClassRepository: ClassRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<ClassModels.MasterModel> {
		return this.ClassRepository.GetById(id);
	}

	async Getall(): Promise<ClassModels.MasterModel[]> {
		return this.ClassRepository.Getall();
	}
	async Create(course: ClassModels.ReqModel): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Create(course);
	}

	async Update(id, course: ClassModels.ReqModel): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Update(id, course);
	}
	async Delete(id): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Delete(id);
	}
}
