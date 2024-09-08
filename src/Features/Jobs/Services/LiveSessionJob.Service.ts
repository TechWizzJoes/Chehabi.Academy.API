import { NotificationsWebSocketGateway } from '@App/Features/-Notifications/WebsocketGateway';
import { LiveSessionModels } from '@App/Features/Session/Session.Models';
import { SessionService } from '@App/Features/Session/Session.Service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LiveSessionJobService {
	constructor(
		private SessionService: SessionService,
		private NotificationsWebSocketGateway: NotificationsWebSocketGateway
	) {}

	async LiveSessionsNotifiyingCron() {
		console.log('LiveSessionsCron');
		let sessions = await this.SessionService.GetCurrentHourSessions();
		// notify users of these sessions that the next session is in one hour
		// this.NotificationsWebSocketGateway.notifyUser(4, 'sessions job notifications')
	}

	GetUsersFromSessions(sessions: LiveSessionModels.MasterModel[]) {
		const users: UserSessions[] = [];
		for (const session of sessions) {
			const className = session.Class.Name;
			const userIds = session.Class.UserClasses.map((uc) => uc.User);
		}
	}
}

class UserSessions {
	ClassName: string;
	userIds: number[];
}
