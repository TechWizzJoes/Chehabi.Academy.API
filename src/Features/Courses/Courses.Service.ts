import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { CoursesRepository } from './Courses.Repository';
import { CoursesModels } from './Courses.Models';
import { promises } from 'dns';
import { ClassModels } from '../Class/Class.Models';
import { CourseTypeEnum } from '@App/Common/Enums/CourseType.Enum';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';

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
		if (course.Classes) course.Classes = course.Classes?.filter((c) => !c.IsDeleted);
		return course;
	}

	async GetAdminCoursesByUserId(): Promise<CoursesModels.MasterModel[]> {
		let user = this.UserHelper.GetCurrentUser();
		let courses = await this.CoursesRepository.GetAdminCoursesByUserId(user.InstructorId);
		return courses;
	}

	async Getall(filter: CoursesModels.Filter): Promise<CoursesModels.MasterModel[]> {
		return this.CoursesRepository.GetAll(filter);
	}

	async Create(course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		course.InstructorId = this.UserHelper.GetCurrentUser()?.InstructorId;
		let courseType = CourseTypeEnum[+course.TypeIdString];
		if (!courseType) throw new ApplicationException('invalid course type id', HttpStatus.BAD_REQUEST);
		course.TypeId = CourseTypeEnum[courseType];
		course.IsActive = course.IsActive;
		course.IsDeleted = false;

		this.ValidateTodaysDate(course);
		return await this.CoursesRepository.Create(course);
	}

	async Update(id, course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		let dbcourse = await this.CoursesRepository.GetById(id);
		this.ValidateClassesDates(course, dbcourse);
		this.ValidateTodaysDate(course);
		return await this.CoursesRepository.Update(id, course);
	}

	async Delete(id): Promise<CoursesModels.MasterModel> {
		return await this.CoursesRepository.Delete(id);
	}

	async Upload(filePath: string): Promise<{}> {
		return { filePath };
	}

	private ValidateClassesDates(course: CoursesModels.CoursesReqModel, dbcourse: CoursesModels.MasterModel): boolean {
		let newStartDate: Date = new Date(course.StartDate);
		newStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare days only
		let oldStartDate: Date = new Date(dbcourse.StartDate);
		if (newStartDate !== oldStartDate) {
			// Find the earliest start date in dbcourse.Classes
			const earliestClassStartDate = dbcourse.Classes.filter(
				(classItem) => classItem.IsActive == true && classItem.IsDeleted == false
			).reduce((earliest, currentClass) => {
				if (!earliest || new Date(currentClass.StartDate) < new Date(earliest)) {
					return currentClass.StartDate;
				}
				return earliest;
			}, null as Date | null);

			// Validate if course.StartDate is greater than the earliest class start date
			if (earliestClassStartDate) {
				let earliestDate = new Date(earliestClassStartDate);
				if (newStartDate > earliestDate)
					//doesnot work if you want the new date to be the same as the earliest date
					throw new ApplicationException(ErrorCodesEnum.COURSE_STARTDATE_EXCEEDED, HttpStatus.BAD_REQUEST);
			}
		}
		return true;
	}

	private ValidateTodaysDate(course: CoursesModels.CoursesReqModel): boolean {
		let newStartDate: Date = new Date(course.StartDate);
		newStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare days only

		const todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);

		if (newStartDate < todaysDate) {
			throw new ApplicationException(ErrorCodesEnum.COURSE_STARTDATE_BEFORE_TODAY, HttpStatus.BAD_REQUEST);
		}
		return true;
	}

	async UpdateCourseRating(id: number, Rating: number, Raters: number): Promise<CoursesModels.MasterModel> {
		let dbcourse = await this.CoursesRepository.GetById(id);
		return await this.CoursesRepository.UpdateCourseRating(id, Rating, Raters);
	}
}
