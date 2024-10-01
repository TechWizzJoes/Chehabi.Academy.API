import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { LiveSessionRepository } from './Session.Repository';
import { LiveSessionModels } from './Session.Models';
import { promises } from 'dns';
import { ClassModels } from '../Class/Class.Models';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { UserService } from '../User/User.Service';
import { NotificationsWebSocketGateway } from '../-Notifications/WebsocketGateway';
import { NotificationsModels } from '../-Notifications/Notifications.Models';
import { NotificationTemplateKey } from '../-Notifications/NotificationTemplateKey';
import { NotificationsService } from '../-Notifications/Notifications.Service';

@Injectable()
export class SessionService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private LiveSessionRepository: LiveSessionRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper,
		private UserService: UserService,
		private NotificationsWebSocketGateway: NotificationsWebSocketGateway,
		private NotificationsService: NotificationsService
	) {
		this.Config = this.appConfig.Config;
	}

	// async GetById(id): Promise<SessionModels.MasterModel> {
	// 	return this.LiveSessionRepository.GetById(id);
	// }

	async GetallByClassId(classId: number): Promise<LiveSessionModels.MasterModel[]> {
		return this.LiveSessionRepository.GetallByClassId(classId);
	}

	async Create(course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Create(course);
	}

	async BulkCreate(sessions: LiveSessionModels.SessionReqModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkCreate(sessions);
	}

	async Update(id, course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Update(id, course);
	}

	async BulkUpdate(sessions: LiveSessionModels.MasterModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkUpdate(sessions);
	}

	async Delete(id: number): Promise<void> {
		return await this.LiveSessionRepository.Delete(id);
	}

	async GetUpcomingByUserId(): Promise<LiveSessionModels.MasterModel[]> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const userClasses = await this.LiveSessionRepository.GetClassesIdsByUserId(CurrentUser.UserId);
		const classIds = userClasses.map((uc) => uc.ClassId);
		const sessions = await this.GetNextWeekSessions(classIds);

		if (!CurrentUser.IsAdmin) {
			sessions.forEach((session) => {
				const userclass = userClasses.find((uc) => uc.ClassId == session.ClassId);
				const blocked = !userclass.IsPaid && session.Order > 1;
				session.Link = blocked ? 'blocked' : session.Link;
				delete session.Class.UserClasses;
			});
		}

		return sessions;
	}

	async GetNextHourSessions(): Promise<LiveSessionModels.MasterModel[]> {
		// Get the start and end of today's date in local time
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));
		// const todaysSessions = sessions.filter(s => s.StartDate >= startOfDay && s.StartDate <= endOfDay);

		// Get the start and end of the current hour in local time
		const now = new Date();
		const startOfCurrentHour = new Date(now.setMinutes(0, 0, 0));

		const startOfHour = new Date(startOfCurrentHour.getTime() + 60 * 60 * 1000);
		const endOfHour = new Date(startOfCurrentHour.getTime() + 2 * 60 * 60 * 1000);
		// Get the start and end of the current hour in UTC
		// const startOfHour = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),0, 0, 0 ));
		// const endOfHour = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),59, 59, 999);

		return await this.LiveSessionRepository.GetCustomHourSessions(startOfHour, endOfHour, null, [
			'Class',
			'Class.UserClasses.User',
			'Class.Course.Instructor.User'
		]);
	}

	async GetPreviousHourSessions(): Promise<LiveSessionModels.MasterModel[]> {
		const now = new Date();
		const startOfCurrentHour = new Date(now.setMinutes(0, 0, 0));
		// Calculate the start of the previous hour
		// const previousHour = 30 * 24 * 60 * 60 * 1000; // for local testing
		const previousHour = 60 * 60 * 1000;
		const startOfPreviousHour = new Date(startOfCurrentHour.getTime() - previousHour); // Subtract one hour
		// Calculate the end of the previous hour
		const endOfPreviousHour = new Date(startOfCurrentHour.getTime() - 1); // End of previous hour is the last moment of the previous hour

		return await this.LiveSessionRepository.GetCustomHourSessions(startOfPreviousHour, endOfPreviousHour);
	}

	async GetNextWeekSessions(classIds: number[]): Promise<LiveSessionModels.MasterModel[]> {
		const today = new Date();
		const startOfCurrentWeek = today;

		const endOfNextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
		endOfNextWeek.setHours(23, 59, 59, 999);

		const relations = ['Class.Course', 'Class.UserClasses'];
		return await this.LiveSessionRepository.GetCustomHourSessions(
			startOfCurrentWeek,
			endOfNextWeek,
			classIds,
			relations
		);
	}

	GenerateSessionDates(
		startDate: Date, // Starting date in "YYYY-MM-DD" format
		periodDto: ClassModels.PeriodDto[],
		numberOfSessions: number
	): ClassModels.SessionDates[] {
		const sessions: ClassModels.SessionDates[] = [];
		let currentDate = new Date(startDate);
		let sessionCount = 0;

		function findPeriodForDay(dayOfWeek: number) {
			return periodDto.find((period) => parseInt(period.Day.toString()) === dayOfWeek);
		}

		// Generate sessions by scanning day by day
		while (sessionCount < numberOfSessions) {
			const dayOfWeek = currentDate.getDay(); // Get current day of the week (0 is Sunday, 1 is Monday, etc.)
			const matchingPeriod = findPeriodForDay(dayOfWeek);

			if (matchingPeriod) {
				const sessionDate = new Date(currentDate);
				const [hours, minutes] = matchingPeriod.Time.split(':').map(Number);
				sessionDate.setHours(hours, minutes);

				sessions.push({ Date: new Date(sessionDate), DurationInMins: matchingPeriod.DurationInMins });
				sessionCount++;
			}
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return sessions;
	}

	async CreateClassSessions(sessionDates: ClassModels.SessionDates[], createdClass: ClassModels.MasterModel) {
		let sessionsReqModel = sessionDates.map((sess, i) => {
			let newSession = new LiveSessionModels.SessionReqModel();
			newSession.ClassId = createdClass.Id;
			newSession.StartDate = sess.Date;
			newSession.Order = i + 1;

			let endDate = new Date(sess.Date);
			endDate.setMinutes(endDate.getMinutes() + sess.DurationInMins);
			newSession.EndDate = endDate;

			return newSession;
		});

		createdClass.LiveSessions = await this.BulkCreate(sessionsReqModel);
	}

	async OnClassUpdate(newClass: ClassModels.ClassReqModel, dbClass: ClassModels.MasterModel) {
		this.ValidateSessionDates(newClass);

		const sessionsLinkUpdated = await this.GetSessionsLinkUpdates(newClass, dbClass);
		await this.RecalculateSessionDates(newClass, dbClass);

		let updatedsessions = await this.BulkUpdate(newClass.LiveSessions);
		if (sessionsLinkUpdated) {
			// notify users of links changing
			this.NotifyUsersForLinkChange(sessionsLinkUpdated, dbClass.Id);
		}
	}

	ValidateSessionDates(reqModel: ClassModels.ClassReqModel): boolean {
		const liveSessions = reqModel.LiveSessions;

		if (new Date(liveSessions[0].StartDate) < new Date(reqModel.StartDate)) {
			throw new ApplicationException(ErrorCodesEnum.SESSION_BEFORE_CLASS, HttpStatus.BAD_REQUEST);
		}

		if (liveSessions.length < 2) {
			return true;
		}

		for (let i = 0; i < liveSessions.length - 1; i++) {
			const currentSession = liveSessions[i];
			const nextSession = liveSessions[i + 1];

			if (new Date(currentSession.StartDate) > new Date(nextSession.StartDate)) {
				throw new ApplicationException(
					`Session ${i + 2} starts before session ${i + 1}.`,
					HttpStatus.BAD_REQUEST
				);
			}
		}
		return true;
	}

	async GetSessionsLinkUpdates(
		newClass: ClassModels.ClassReqModel,
		dbClass: ClassModels.MasterModel
	): Promise<LiveSessionModels.MasterModel[]> {
		const changedSessions: LiveSessionModels.MasterModel[] = [];

		// Map newClass sessions by Id for quick lookup
		const newSessionsMap = new Map<number, LiveSessionModels.MasterModel>();
		newClass.LiveSessions.forEach((session) => {
			newSessionsMap.set(session.Id, session);
		});

		// Iterate through dbClass sessions and compare links
		dbClass.LiveSessions.forEach((dbSession) => {
			const newSession = newSessionsMap.get(dbSession.Id);
			if (newSession && newSession.Link !== dbSession.Link) {
				changedSessions.push(newSession);
			}
		});

		return changedSessions;
	}

	async RecalculateSessionDates(
		newClass: ClassModels.ClassReqModel,
		dbClass: ClassModels.MasterModel
	): Promise<LiveSessionModels.MasterModel[]> {
		const changedSessions: LiveSessionModels.MasterModel[] = [];

		const newSessionsMap = new Map<number, LiveSessionModels.MasterModel>();
		newClass.LiveSessions.forEach((session) => {
			newSessionsMap.set(session.Id, session);
		});

		dbClass.LiveSessions.forEach((dbSession) => {
			const newSession = newSessionsMap.get(dbSession.Id);

			const newDate = new Date(newSession.StartDate);
			const oldDate = new Date(dbSession.StartDate);

			if (newDate.getTime() !== oldDate.getTime()) {
				const newSession = newSessionsMap.get(dbSession.Id);
				changedSessions.push(newSession);

				let endDate = new Date(newSession.StartDate);
				const durationInMins = (dbSession.EndDate.getTime() - dbSession.StartDate.getTime()) / 60000;
				endDate.setMinutes(endDate.getMinutes() + durationInMins);
				newSession.EndDate = endDate;
			}
		});

		return changedSessions;
	}

	async NotifyUsersForLinkChange(sessionsLinkUpdated: LiveSessionModels.MasterModel[], classId: number) {
		const userClasses = await this.UserService.GetUsersByClassId(classId);

		for (const session of sessionsLinkUpdated) {
			for (const userClass of userClasses) {
				const message = `next session link is updated.`;
				this.NotificationsWebSocketGateway.notifyUser(userClass.UserId, message);
				this.SendEmailNotfication({
					Email: userClass.User.Email,
					Placeholders: {
						FirstName: userClass.User.FirstName,
						LastName: userClass.User.LastName,
						SessionDetails: message
					}
				});
			}
		}
	}

	SendEmailNotfication(payload: NotificationsModels.NotificationPayload) {
		const emailType = NotificationTemplateKey.Email.REMINDER;
		this.NotificationsService.sendNotificationEmail(emailType, payload);
	}
}
