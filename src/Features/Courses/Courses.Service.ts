import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { CoursesRepository } from './Courses.Repository';
import { CoursesModels } from './Courses.Models';
import { promises } from 'dns';
import { ClassModels } from '../Class/Class.Models';

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
		let course = await this.CoursesRepository.GetById(id);
		let user = this.UserHelper.GetCurrentUser();
		if (course.Classes) course.Classes = course.Classes?.filter((c) => c.IsActive || user.IsAdmin);
		return course;
	}

	async GetAdminCoursesByUserId(): Promise<CoursesModels.MasterModel[]> {
		let user = this.UserHelper.GetCurrentUser();
		let courses = await this.CoursesRepository.GetAdminCoursesByUserId(user.UserId);
		return courses;
	}

	async GetEnrolledClassesByUserId(): Promise<ClassModels.MasterModel[]> {
		let user = this.UserHelper.GetCurrentUser();
		let courses = await this.CoursesRepository.GetEnrolledClassesByUserId(user.UserId);
		return courses;
	}

	async Getall(): Promise<CoursesModels.MasterModel[]> {
		return this.CoursesRepository.GetAll();
	}
	async Create(course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		course.InstructorId = this.UserHelper.GetCurrentUser()?.UserId;
		course.IsActive = course.IsActive ?? true;
		course.IsDeleted = false;
		return await this.CoursesRepository.Create(course);
	}

	async Update(id, course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Update(id, course);
	}
	async Delete(id): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Delete(id);
	}

	async Upload(filePath: string): Promise<{}> {
		return { filePath };
	}
}
