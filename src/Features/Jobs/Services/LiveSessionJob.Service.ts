import { NotificationsWebSocketGateway } from '@App/Features/-Notifications/WebsocketGateway';
import { LiveSessionModels } from '@App/Features/Session/Session.Models';
import { SessionService } from '@App/Features/Session/Session.Service';
import { InstructorModels } from '@App/Features/User/Instructor.Models';
import { UserModels } from '@App/Features/User/User.Models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LiveSessionJobService {
	constructor(
		private SessionService: SessionService,
		private NotificationsWebSocketGateway: NotificationsWebSocketGateway
	) {}

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
				const message = `Class: ${userSession.ClassName}, Session No. ${2} starts in one hour at ${
					userSession.Time
				}`;
				this.NotificationsWebSocketGateway.notifyUser(user.Id, message);
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
			const message = `Next session of ${userSession.ClassName} class starts in one hour at ${userSession.Time}.`;
			this.NotificationsWebSocketGateway.notifyUser(userSession.Instructor.UserId, message);

			if (!userSession.Link) {
				const message = `Please Add a meeting link for the upcoming session from ${userSession.ClassName} class.`;
				this.NotificationsWebSocketGateway.notifyUser(userSession.Instructor.UserId, message);
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
