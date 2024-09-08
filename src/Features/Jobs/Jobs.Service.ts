import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LiveSessionJobService } from './Services/LiveSessionJob.Service';
import { ClassCurrentIndexJobService } from './Services/ClassCurrentIndexJob.Service';

@Injectable()
export class JobsService {
	constructor(
		private LiveSessionJobService: LiveSessionJobService,
		private ClassCurrentIndexJobService: ClassCurrentIndexJobService
	) {}

	@Cron(CronExpression.EVERY_HOUR)
	LiveSessionsNotifiyingCron() {
		console.log('LiveSessionsNotifiyingCron');
		this.LiveSessionJobService.LiveSessionsNotifiyingCron();
	}

	@Cron(CronExpression.EVERY_HOUR)
	ClassCurrentIndexJob() {
		console.log('ClassCurrentIndexJob');
		this.ClassCurrentIndexJobService.ClassCurrentIndexJob();
	}
}
