import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { ClassRepository } from './Class.Repository';
import { ClassModels } from './Class.Models';
import { UserService } from '../User/User.Service';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { CoursesService } from '../Courses/Courses.Service';
import { SessionService } from '../Session/Session.Service';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';

@Injectable()
export class ClassService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private ClassRepository: ClassRepository,
		private UserService: UserService,
		private CoursesService: CoursesService,
		private SessionService: SessionService,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetEnrolledClassesByUserId(): Promise<UserModels.UserClass[]> {
		let user = this.UserHelper.GetCurrentUser();
		let userClasses = await this.ClassRepository.GetEnrolledClassesByUserId(user.UserId);
		// sort by activeness and start dates asc
		const sortedUserClasses = userClasses.sort((a, b) => {
			if (a.Class.IsActive !== b.Class.IsActive) {
				return a.Class.IsActive ? -1 : 1;
			}
			return new Date(a.Class.StartDate) > new Date(b.Class.StartDate) ? -1 : 1;
		});
		return sortedUserClasses;
	}

	async GetById(id: number): Promise<ClassModels.MasterModel> {
		const dbClass = await this.ClassRepository.GetById(id);
		// this.UserHelper.ValidateOwnerShip(dbClass.CreatedBy);
		return dbClass;
	}

	async Create(newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		newClass.IsActive = newClass.IsActive ?? true;
		newClass.IsDeleted = false;
		newClass.CreatedBy = CurrentUser.UserId;

		let dbcourse = await this.CoursesService.GetById(newClass.CourseId);
		this.ValidateTodaysDate(newClass);
		this.ValidateCourseDate(dbcourse, newClass);

		const sessionDates = this.SessionService.GenerateSessionDates(
			newClass.StartDate,
			newClass.Period,
			newClass.TimeZone,
			newClass.NumberOfSessions
		);
		// console.log(sessionDates)
		newClass.EndDate = sessionDates[sessionDates.length - 1].Date;

		let createdClass = await this.ClassRepository.Create(newClass);
		await this.SessionService.CreateClassSessions(sessionDates, createdClass);

		return createdClass;
	}

	async Update(id, newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		let dbClass = await this.ClassRepository.GetById(id);
		let dbcourse = dbClass.Course;

		this.UserHelper.ValidateOwnerShip(dbClass.CreatedBy);
		this.ValidateCourseDate(dbcourse, newClass);
		this.ValidateTodaysDate(newClass, dbClass);
		this.ValidateSessionDates(newClass, dbClass);

		await this.SessionService.OnClassUpdate(newClass, dbClass);

		let updatedClass = await this.ClassRepository.Update(id, newClass);
		return updatedClass;
	}

	async Delete(id): Promise<ClassModels.MasterModel> {
		let dbClass = await this.ClassRepository.GetById(id);
		this.UserHelper.ValidateOwnerShip(dbClass.CreatedBy);
		return await this.ClassRepository.Delete(id);
	}

	async JoinFreeTrial(classId: number): Promise<UserModels.UserClass> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		await this.ValidateUserJoiningClass(CurrentUser.UserId, classId, true);

		const IsPaid = false;
		const userClass: UserModels.UserClass = await this.UserService.AddUserToClass(
			CurrentUser.UserId,
			classId,
			IsPaid
		);
		return userClass;
	}

	async JoinClass(userId: number, classId: number): Promise<UserModels.UserClass> {
		await this.ValidateUserJoiningClass(userId, classId);

		const IsPaid = true;
		const userClass: UserModels.UserClass = await this.UserService.AddUserToClass(userId, classId, IsPaid);
		return userClass;
	}

	async ValidateUserJoiningClass(userId: number, classId: number, FreeTrial: boolean = false) {
		const selectedClass: ClassModels.MasterModel = await this.GetById(classId);
		// const selectedCourse: CoursesModels.MasterModel = await this.CoursesService.GetById(selectedClass.CourseId);
		const userClasses: UserModels.UserClass[] = await this.ClassRepository.GetUsers(classId);
		// const userExistsInCourse:UserModels.UserCourse = await this.UserService.GetUserCourseByUserId(userId);

		if (!selectedClass) throw new NotFoundException();
		if (FreeTrial) {
			// validate the free trial joining
			if (!selectedClass.HasFreeTrial)
				throw new HttpException(ErrorCodesEnum.CLASS_HAS_NO_FREETRIAL, HttpStatus.BAD_REQUEST);
		}
		if (!selectedClass.IsActive) throw new HttpException(ErrorCodesEnum.CLASS_INACTIVE, HttpStatus.BAD_REQUEST);
		if (selectedClass.IsDeleted) throw new HttpException(ErrorCodesEnum.CLASS_DELETED, HttpStatus.BAD_REQUEST);
		if (userClasses.length >= selectedClass.MaxCapacity)
			throw new HttpException(ErrorCodesEnum.MAX_CLASS_USERS, HttpStatus.BAD_REQUEST);

		// check for users that has freetrial and now wants to pay
		const userJoinedClass = userClasses.find((c) => c.UserId == userId);
		if (userJoinedClass) {
			if (FreeTrial) {
				throw new HttpException(ErrorCodesEnum.USER_EXISTS_CLASS, HttpStatus.BAD_REQUEST);
			} else {
				if (userJoinedClass.IsPaid) {
					throw new HttpException(ErrorCodesEnum.USER_EXISTS_CLASS, HttpStatus.BAD_REQUEST);
				}
			}
		}
		if (selectedClass.CurrentIndex && !userJoinedClass)
			throw new HttpException(ErrorCodesEnum.CLASS_Started, HttpStatus.BAD_REQUEST);

		// if (userExistsInCourse) throw new HttpException(ErrorCodesEnum.USER_EXISTS_COURSE, HttpStatus.BAD_REQUEST);
	}

	private ValidateCourseDate(dbcourse: CoursesModels.MasterModel, newClass: ClassModels.ClassReqModel): boolean {
		if (new Date(newClass.StartDate) < new Date(dbcourse.StartDate)) {
			throw new ApplicationException(ErrorCodesEnum.CLASS_BEFORE_COURSE, HttpStatus.BAD_REQUEST);
		}
		return true;
	}

	private ValidateTodaysDate(newClass: ClassModels.ClassReqModel, dbClass?: ClassModels.MasterModel): boolean {
		// if start date hasn't changed
		if (
			dbClass &&
			new Date(newClass.StartDate).setHours(0, 0, 0) == new Date(dbClass.StartDate).setHours(0, 0, 0)
		) {
			return true;
		}
		let newStartDate: Date = new Date(newClass.StartDate);
		newStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare days only

		const todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);

		if (newStartDate < todaysDate) {
			throw new ApplicationException(ErrorCodesEnum.Class_STARTDATE_BEFORE_TODAY, HttpStatus.BAD_REQUEST);
		}
		return true;
	}

	private ValidateSessionDates(newClass: ClassModels.ClassReqModel, dbClass?: ClassModels.MasterModel): boolean {
		const firstSession = dbClass.LiveSessions.find((s) => s.Order === 1);
		if (firstSession && new Date(firstSession.StartDate) < new Date(newClass.StartDate)) {
			throw new ApplicationException(ErrorCodesEnum.CLASS_AFTER_SESSION, HttpStatus.BAD_REQUEST);
		}
		return true;
	}

	async GetByIds(ids: number[]): Promise<ClassModels.MasterModel[]> {
		return this.ClassRepository.GetByIds(ids);
	}

	async BulkUpdate(classes: ClassModels.MasterModel[]): Promise<ClassModels.MasterModel[]> {
		classes.forEach((c) => delete c.LiveSessions);
		let updatedClasses = await this.ClassRepository.BulkUpdate(classes);
		return updatedClasses;
	}
}
