import { ClassService } from '@App/Features/Class/Class.Service';
import { SessionService } from '@App/Features/Session/Session.Service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassCurrentIndexJobService {
	constructor(private SessionService: SessionService, private ClassService: ClassService) {}

	async ClassCurrentIndexCron() {
		console.log('ClassCurrentIndexCron');

		let sessions = await this.SessionService.GetPreviousHourSessions();
		sessions.forEach((s) => (s.IsCompleted = true));
		await this.SessionService.BulkUpdate(sessions);

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
