import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { ClassRepository } from './Class.Repository';
import { ClassModels } from './Class.Models';
import { promises } from 'dns';
import { UserService } from '../User/User.Service';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { CoursesService } from '../Courses/Courses.Service';
import { SessionService } from '../Session/Session.Service';
import { LiveSessionModels } from '../Session/Session.Models';
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

	async GetEnrolledClassesByUserId(): Promise<ClassModels.MasterModel[]> {
		let user = this.UserHelper.GetCurrentUser();
		let courses = await this.ClassRepository.GetEnrolledClassesByUserId(user.UserId);
		return courses;
	}

	async GetById(id: number): Promise<ClassModels.MasterModel> {
		return this.ClassRepository.GetById(id);
	}

	async Create(newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		newClass.IsActive = newClass.IsActive ?? true;
		newClass.IsDeleted = false;

		let dbcourse = await this.CoursesService.GetById(newClass.CourseId);
		this.ValidateTodaysDate(newClass);
		this.ValidateCourseDate(dbcourse, newClass);

		// get session dates from the periodDto
		const sessionDates = this.GenerateSessionDates(newClass.StartDate, newClass.Period, newClass.NumberOfSessions);
		newClass.EndDate = sessionDates[sessionDates.length - 1];

		let createdClass = await this.ClassRepository.Create(newClass);

		let sessionsReqModel = sessionDates.map((date) => {
			let newSession = new LiveSessionModels.SessionReqModel();
			newSession.ClassId = createdClass.Id;
			newSession.StartDate = date;

			let endDate = new Date(date);
			endDate.setHours(endDate.getHours() + 2);

			newSession.EndDate = endDate;
			return newSession;
		});
		createdClass.LiveSessions = await this.SessionService.BulkCreate(sessionsReqModel);

		return createdClass;
	}

	async Update(id, newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		let dbcourse = (await this.ClassRepository.GetById(id)).Course;
		this.ValidateCourseDate(dbcourse, newClass);
		this.ValidateSessionDates(newClass);
		this.ValidateTodaysDate(newClass);

		let updatedsessions = await this.SessionService.BulkUpdate(newClass.LiveSessions);
		let updatedClass = await this.ClassRepository.Update(id, newClass);
		return updatedClass;
	}

	async Delete(id): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Delete(id);
	}

	async JoinClass(classId: number): Promise<any> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const selectedClass: ClassModels.MasterModel = await this.GetById(classId);
		const selectedCourse: CoursesModels.MasterModel = await this.CoursesService.GetById(selectedClass.CourseId);

		const userExistsInClass =
			selectedCourse.Classes.filter((c) => {
				let userIdsInClass = [];
				if (c.IsActive) {
					userIdsInClass = c.Users?.map((u) => u.Id);
				}
				return userIdsInClass.includes(CurrentUser.UserId);
			}).length > 0;

		if (!selectedClass) throw new NotFoundException();
		if (selectedClass.Users.length >= selectedClass.MaxCapacity)
			throw new HttpException(ErrorCodesEnum.MAX_CLASS_USERS, HttpStatus.BAD_REQUEST);
		if (selectedClass.Users.find((c) => c.Id == CurrentUser.UserId))
			throw new HttpException(ErrorCodesEnum.USER_EXISTS_CLASS, HttpStatus.BAD_REQUEST);
		if (userExistsInClass) throw new HttpException(ErrorCodesEnum.USER_EXISTS_COURSE, HttpStatus.BAD_REQUEST);

		const user: UserModels.MasterModel = await this.UserService.GetById(CurrentUser.UserId);
		user.Classes.push(selectedClass);
		let updatedUser = await this.UserService.UpdateUser(user);
		return updatedUser;
	}

	private GenerateSessionDates(
		startDate: Date, // Starting date in "YYYY-MM-DD" format
		periodDto: ClassModels.PeriodDto[], // PeriodDto array (Day of week and time)
		numberOfSessions: number // Number of sessions to generate
	): Date[] {
		const sessions: Date[] = [];
		let currentDate = new Date(startDate); // Convert start date to Date object
		let sessionCount = 0;

		// Function to find a matching period for a given day
		function findPeriodForDay(dayOfWeek: number) {
			return periodDto.find((period) => parseInt(period.Day.toString()) === dayOfWeek);
		}

		// Generate sessions by scanning day by day
		while (sessionCount < numberOfSessions) {
			const dayOfWeek = currentDate.getDay(); // Get current day of the week (0 is Sunday, 1 is Monday, etc.)

			// Find a matching period for the current day
			const matchingPeriod = findPeriodForDay(dayOfWeek);

			if (matchingPeriod) {
				// Create a session if a matching period is found
				const sessionDate = new Date(currentDate);
				const [hours, minutes] = matchingPeriod.Time.split(':').map(Number);
				sessionDate.setHours(hours, minutes);

				// Add this session to the sessions array
				sessions.push(new Date(sessionDate));

				// Increment session count
				sessionCount++;
			}

			// Move to the next day
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return sessions;
	}

	private ValidateSessionDates(reqModel: ClassModels.ClassReqModel): boolean {
		const liveSessions = reqModel.LiveSessions;

		// check if the first session is before class start date
		if (new Date(liveSessions[0].StartDate) < new Date(reqModel.StartDate)) {
			throw new ApplicationException(ErrorCodesEnum.SESSION_BEFORE_CLASS, HttpStatus.BAD_REQUEST);
		}

		if (liveSessions.length < 2) {
			return true;
		}

		for (let i = 0; i < liveSessions.length - 1; i++) {
			const currentSession = liveSessions[i];
			const nextSession = liveSessions[i + 1];

			// check if sessions order is persisted in its dates
			if (new Date(currentSession.StartDate) > new Date(nextSession.StartDate)) {
				throw new ApplicationException(
					`Session ${i + 2} starts before session ${i + 1}.`,
					HttpStatus.BAD_REQUEST
				);
			}
		}

		return true;
	}

	private ValidateCourseDate(dbcourse: CoursesModels.MasterModel, newClass: ClassModels.ClassReqModel): boolean {
		if (new Date(newClass.StartDate) < new Date(dbcourse.StartDate)) {
			throw new ApplicationException(ErrorCodesEnum.CLASS_BEFORE_COURSE, HttpStatus.BAD_REQUEST);
		}
		return true;
	}

	private ValidateTodaysDate(newClass: ClassModels.ClassReqModel): boolean {
		let newStartDate: Date = new Date(newClass.StartDate);
		newStartDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to compare days only

		const todaysDate = new Date();
		todaysDate.setHours(0, 0, 0, 0);

		if (newStartDate < todaysDate) {
			throw new ApplicationException(ErrorCodesEnum.Class_STARTDATE_BEFORE_TODAY, HttpStatus.BAD_REQUEST);
		}
		return true;
	}
}
