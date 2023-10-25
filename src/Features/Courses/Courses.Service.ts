import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { CoursesRepository } from './Courses.Repository';
import { CoursesModels } from './Courses.Models';
import { AccountException } from '@App/Common/Exceptions/Login.Exception';
import { promises } from 'dns';

@Injectable()
export class CoursesService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private CoursesRepository: CoursesRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<CoursesModels.MasterModel> {
		return this.CoursesRepository.GetById(id);
	}

	async Getall(): Promise<CoursesModels.MasterModel[]> {
		return this.CoursesRepository.Getall();
	}
	async Create(course: CoursesModels.ReqModel): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Create(course);
	}

	async Update(id, course: CoursesModels.ReqModel): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Update(id, course);
	}
	async Delete(id): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Delete(id);
	}
}