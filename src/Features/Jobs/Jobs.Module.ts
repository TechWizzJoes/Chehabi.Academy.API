import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsService } from './Jobs.Service';
import { SessionService } from '../Session/Session.Service';
import { NotificationsModule } from '../-Notifications/Notifications.Module';
import { AppConfig } from '@App/Config/App.Config';
import { SessionModule } from '../Session/Session.Module';
import { LiveSessionJobService } from './Services/LiveSessionJob.Service';
import { ClassCurrentIndexJobService } from './Services/ClassCurrentIndexJob.Service';
import { ClassModule } from '../Class/Class.Module';
@Module({
	imports: [ScheduleModule.forRoot(), NotificationsModule, SessionModule, ClassModule],
	controllers: [],
	providers: [JobsService, LiveSessionJobService, ClassCurrentIndexJobService]
})
export class JobsModule {}
