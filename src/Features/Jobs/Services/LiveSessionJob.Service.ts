import { LiveSessionModels } from '@App/Features/Session/Session.Models';
import { SessionService } from '@App/Features/Session/Session.Service';
import { InstructorModels } from '@App/Features/User/Instructor.Models';
import { UserModels } from '@App/Features/User/User.Models';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { NotificationTemplateKey } from '@App/Features/-Notifications/NotificationTemplateKey';
import { NotificationModels } from '@App/Features/-Notifications/Notifications.Models';

@Injectable()
export class LiveSessionJobService {
	constructor(private SessionService: SessionService, private NotificationsService: NotificationsService) {}

	async LiveSessionsNotifiyingJob() {
		console.log('LiveSessionsCron');

		let sessions = await this.SessionService.GetNextHourSessions();
		this.NotifySessionsUsers(sessions);
		this.NotifySessionsInstructors(sessions);
	}

	NotifySessionsUsers(sessions: LiveSessionModels.MasterModel[]) {
		let UserSessions = this.GetUsersFromSessions(sessions);
		this.notifyUsers(UserSessions);
	}

	GetUsersFromSessions(sessions: LiveSessionModels.MasterModel[]) {
		const userSessions: UserSessions[] = [];
		for (const session of sessions) {
			const userSession = new UserSessions();
			userSession.ClassName = session.Class.Name;
			userSession.CourseName = session.Class.Course.Name;
			userSession.Time = session.StartDate.toString();
			userSession.Users = session.Class.UserClasses.map((uc) => uc.User);
			userSessions.push(userSession);
		}
		return userSessions;
	}

	notifyUsers(userSessions: UserSessions[]) {
		// notify users of these sessions that the next session is in one hour
		for (const userSession of userSessions) {
			for (const user of userSession.Users) {
				this.NotificationsService.NotifyUser({
					Type: NotificationTemplateKey.SESSION_REMINDER_USER,
					User: user,
					Placeholders: {
						FirstName: user.FirstName,
						LastName: user.LastName,
						ClassName: userSession.ClassName,
						Time: userSession.Time
					}
				});
			}
		}
	}

	NotifySessionsInstructors(sessions: LiveSessionModels.MasterModel[]) {
		let InstructorSessions = this.GetInstructorsFromSessions(sessions);
		this.notifyInstructors(InstructorSessions);
	}

	GetInstructorsFromSessions(sessions: LiveSessionModels.MasterModel[]) {
		const userSessions: InstructorSessions[] = [];
		for (const session of sessions) {
			const userSession = new InstructorSessions();
			userSession.ClassName = session.Class.Name;
			userSession.CourseName = session.Class.Course.Name;
			userSession.Time = session.StartDate.toString();
			userSession.Link = session.Link;
			userSession.Instructor = session.Class.Course.Instructor;
			userSessions.push(userSession);
		}
		return userSessions;
	}

	notifyInstructors(userSessions: InstructorSessions[]) {
		// notify users of these sessions that the next session is in one hour
		for (const userSession of userSessions) {
			this.NotificationsService.NotifyUser({
				Type: NotificationTemplateKey.SESSION_REMINDER_INSTRUCTOR,
				User: userSession.Instructor.User,
				Placeholders: {
					FirstName: userSession.Instructor.User.FirstName,
					LastName: userSession.Instructor.User.LastName,
					ClassName: userSession.ClassName,
					Time: userSession.Time
				}
			});
			if (!userSession.Link) {
				this.NotificationsService.NotifyUser({
					Type: NotificationTemplateKey.SESSION_MEETING_LINK_REMINDER,
					User: userSession.Instructor.User,
					Placeholders: {
						FirstName: userSession.Instructor.User.FirstName,
						LastName: userSession.Instructor.User.LastName,
						ClassName: userSession.ClassName
					}
				});
			}
		}
	}
}

class UserSessions {
	ClassName: string;
	CourseName: string;
	Time: string;
	Users: UserModels.MasterModel[];
}

class InstructorSessions {
	ClassName: string;
	CourseName: string;
	Time: string;
	Link: string;
	Instructor: InstructorModels.MasterModel;
}
