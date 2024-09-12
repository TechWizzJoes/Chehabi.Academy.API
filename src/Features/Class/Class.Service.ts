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
import { NotificationsWebSocketGateway } from '../-Notifications/WebsocketGateway';

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
		private UserHelper: UserHelper,
		private NotificationsWebSocketGateway: NotificationsWebSocketGateway
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

	GetUsersByClassId(classId: number): Promise<UserModels.UserClass[]> {
		return this.ClassRepository.GetUsersByClassId(classId);
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
		newClass.EndDate = sessionDates[sessionDates.length - 1].Date;

		let createdClass = await this.ClassRepository.Create(newClass);

		let sessionsReqModel = sessionDates.map((sess) => {
			let newSession = new LiveSessionModels.SessionReqModel();
			newSession.ClassId = createdClass.Id;
			newSession.StartDate = sess.Date;

			let endDate = new Date(sess.Date);
			endDate.setMinutes(endDate.getMinutes() + sess.DurationInMins);

			newSession.EndDate = endDate;
			return newSession;
		});
		createdClass.LiveSessions = await this.SessionService.BulkCreate(sessionsReqModel);

		return createdClass;
	}

	async Update(id, newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		let dbClass = await this.ClassRepository.GetById(id);
		let dbcourse = dbClass.Course;

		this.ValidateCourseDate(dbcourse, newClass);
		this.ValidateSessionDates(newClass);
		this.ValidateTodaysDate(newClass, dbClass);

		const sessionsLinkUpdated = await this.SessionService.GetSessionsLinkUpdates(newClass, dbClass);
		let updatedsessions = await this.SessionService.BulkUpdate(newClass.LiveSessions);
		if (sessionsLinkUpdated) {
			// notify users of links changing
			this.NotifyUsersForLinkChange(sessionsLinkUpdated, dbClass.Id);
		}
		let updatedClass = await this.ClassRepository.Update(id, newClass);
		return updatedClass;
	}

	async Delete(id): Promise<ClassModels.MasterModel> {
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
		if (selectedClass.CurrentIndex) throw new HttpException(ErrorCodesEnum.CLASS_Started, HttpStatus.BAD_REQUEST);
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
		// if (userExistsInCourse) throw new HttpException(ErrorCodesEnum.USER_EXISTS_COURSE, HttpStatus.BAD_REQUEST);
	}

	private GenerateSessionDates(
		startDate: Date, // Starting date in "YYYY-MM-DD" format
		periodDto: ClassModels.PeriodDto[], // PeriodDto array (Day of week and time)
		numberOfSessions: number // Number of sessions to generate
	): ClassModels.SessionDates[] {
		const sessions: ClassModels.SessionDates[] = [];
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
				sessions.push({ Date: new Date(sessionDate), DurationInMins: matchingPeriod.DurationInMins });

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

	async GetByIds(ids: number[]): Promise<ClassModels.MasterModel[]> {
		return this.ClassRepository.GetByIds(ids);
	}

	async BulkUpdate(classes: ClassModels.MasterModel[]): Promise<ClassModels.MasterModel[]> {
		classes.forEach((c) => delete c.LiveSessions);
		let updatedClasses = await this.ClassRepository.BulkUpdate(classes);
		return updatedClasses;
	}

	async NotifyUsersForLinkChange(sessionsLinkUpdated: LiveSessionModels.MasterModel[], classId: number) {
		const userClasses = await this.GetUsersByClassId(classId);

		for (const session of sessionsLinkUpdated) {
			for (const userClass of userClasses) {
				const message = `next session link is updated.`;
				this.NotificationsWebSocketGateway.notifyUser(userClass.UserId, message);
			}
		}
	}
}
