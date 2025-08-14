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
import { CourseLevelEnum } from '@App/Common/Enums/CourseLevel.Enum';
import { ClassService } from '../Class/Class.Service';

@Injectable()
export class CoursesService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private CoursesRepository: CoursesRepository,
		// private classService: ClassService,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<CoursesModels.MasterModel> {
		let course = await this.CoursesRepository.GetById(id);
		if (course.Classes) {
			course.Classes = course.Classes?.filter((c) => !c.IsDeleted);

		}
		return course;
	}

	async GetByIdPublic(id): Promise<CoursesModels.MasterModel> {
		let user = this.UserHelper.GetCurrentUser();
		let course = await this.CoursesRepository.GetByIdPublic(id);
		course.Classes?.forEach(c => {
			c.AvailableSlots = c.MaxCapacity - c.UserClasses.length;
			const joinedClass = c.UserClasses.find(uc => uc.UserId == user.UserId);
			if (joinedClass) {
				if (joinedClass.IsPaid) {
					c.IsJoined = true;
				}
				else
					c.IsJoinedFreeTrial = true;
			}
		});
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
		const CurrentUser = this.UserHelper.GetCurrentUser();
		course.InstructorId = CurrentUser.InstructorId;

		let courseType = CourseTypeEnum[+course.TypeIdString];
		if (!courseType) throw new ApplicationException(ErrorCodesEnum.INVALID_COURSE_TYPE, HttpStatus.BAD_REQUEST);
		course.TypeId = CourseTypeEnum[courseType];

		let courseLevel = CourseLevelEnum[+course.LevelIdString];
		if (!courseLevel) throw new ApplicationException(ErrorCodesEnum.INVALID_COURSE_LEVEL, HttpStatus.BAD_REQUEST);
		course.LevelId = CourseLevelEnum[courseLevel];

		course.IsActive = course.IsActive;
		course.IsDeleted = false;
		course.CreatedBy = CurrentUser.UserId;

		this.ValidateTodaysDate(course);
		return await this.CoursesRepository.Create(course);
	}

	async Update(id, course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		let dbcourse = await this.CoursesRepository.GetById(id);
		this.UserHelper.ValidateOwnerShip(dbcourse.CreatedBy);
		this.ValidateClassesDates(course, dbcourse);
		this.ValidateTodaysDate(course, dbcourse);
		return await this.CoursesRepository.Update(id, course);
	}

	async Delete(id): Promise<CoursesModels.MasterModel> {
		let dbcourse = await this.CoursesRepository.GetById(id);
		this.UserHelper.ValidateOwnerShip(dbcourse.CreatedBy);
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

	private ValidateTodaysDate(course: CoursesModels.CoursesReqModel, dbcourse?: CoursesModels.MasterModel): boolean {
		// if start date hasn't changed
		if (
			dbcourse &&
			new Date(course.StartDate).setHours(0, 0, 0) == new Date(dbcourse.StartDate).setHours(0, 0, 0)
		) {
			return true;
		}

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
		return await this.CoursesRepository.UpdateCourseRating(id, Rating, Raters);
	}

	ValidateDownloadPublic(fileName: string) {
		const isSample = fileName.includes('.sample.') || !fileName.includes('.pdf'); //for courses images
		return isSample;
	}

	async ValidateDownload(courseId: number, fileName: string, isAdmin: boolean) {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const course = await this.GetById(courseId);

		if (isAdmin && course.Instructor.UserId != CurrentUser.UserId)
			throw new ApplicationException(ErrorCodesEnum.NON_INSTRUCTOR_MATERIAL_DOWNLOAD, HttpStatus.FORBIDDEN);

		const userEnrolled = (await this.CoursesRepository.GetEnrolledCoursesByUserId(CurrentUser.UserId)).filter(
			(c) => c.Class.CourseId == courseId && c.IsPaid
		);
		const isSample = fileName.includes('.sample.');
		if (!userEnrolled && !isSample)
			throw new ApplicationException(ErrorCodesEnum.NON_PAID_MATERIAL_DOWNLOAD, HttpStatus.FORBIDDEN);
	}
}
