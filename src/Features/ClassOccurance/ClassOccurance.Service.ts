import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { ClassOccuranceRepository } from './ClassOccurance.Repository';
import { ClassOccuranceModels } from './ClassOccurance.Models';
import { promises } from 'dns';

@Injectable()
export class ClassOccuranceService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private ClassOccuranceRepository: ClassOccuranceRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	// async GetById(id): Promise<ClassOccuranceModels.MasterModel> {
	// 	return this.ClassOccuranceRepository.GetById(id);
	// }

	async GetallByClassId(classId: number): Promise<ClassOccuranceModels.MasterModel[]> {
		return this.ClassOccuranceRepository.GetallByClassId(classId);
	}

	async Create(course: ClassOccuranceModels.ClassOccuranceReqModel): Promise<ClassOccuranceModels.MasterModel> {
		return await this.ClassOccuranceRepository.Create(course);
	}

	async Update(id, course: ClassOccuranceModels.ClassOccuranceReqModel): Promise<ClassOccuranceModels.MasterModel> {
		return await this.ClassOccuranceRepository.Update(id, course);
	}

	async Delete(id: number): Promise<void> {
		return await this.ClassOccuranceRepository.Delete(id);
	}
}
