import { NotificationsWebSocketGateway } from '@App/Features/-Notifications/WebsocketGateway';
import { LiveSessionModels } from '@App/Features/Session/Session.Models';
import { SessionService } from '@App/Features/Session/Session.Service';
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
}

class UserSessions {
	ClassName: string;
	CourseName: string;
	Time: string;
	Users: UserModels.MasterModel[];
}
