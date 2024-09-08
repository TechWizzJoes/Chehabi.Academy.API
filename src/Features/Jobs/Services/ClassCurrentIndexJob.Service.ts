import { ClassService } from '@App/Features/Class/Class.Service';
import { LiveSessionModels } from '@App/Features/Session/Session.Models';
import { SessionService } from '@App/Features/Session/Session.Service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassCurrentIndexJobService {
	constructor(private SessionService: SessionService, private ClassService: ClassService) {}

	async ClassCurrentIndexJob() {
		console.log('ClassCurrentIndexCron');

		const sessions = await this.CompleteSessions();
		await this.HandleClassesIndexAndCompletion(sessions);
	}

	async CompleteSessions(): Promise<LiveSessionModels.MasterModel[]> {
		let sessions = await this.SessionService.GetPreviousHourSessions();
		sessions.forEach((s) => (s.IsCompleted = true));
		await this.SessionService.BulkUpdate(sessions);
		return sessions;
	}

	async HandleClassesIndexAndCompletion(sessions: LiveSessionModels.MasterModel[]) {
		let classesIds = sessions.map((s) => s.Class.Id);
		let classes = await this.ClassService.GetByIds(classesIds);

		classes.forEach((cl) => {
			const sessionsCompleted = cl.LiveSessions.filter((s) => s.IsCompleted).length;
			cl.CurrentIndex = sessionsCompleted;

			// set class as inactive if sessions are completed
			if (cl.CurrentIndex == cl.NumberOfSessions) {
				cl.IsActive = false;
			}
		});
		this.ClassService.BulkUpdate(classes);
	}
}
