import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { LiveSessionRepository } from './Session.Repository';
import { SessionController } from './Session.Controller';
import { SessionService } from './Session.Service';
import { NotificationsModule } from '../-Notifications/Notifications.Module';
import { UserModule } from '../User/User.Module';

@Module({
	imports: [DataModule, CommonModule, UserModule, NotificationsModule],
	controllers: [SessionController],
	providers: [AppConfig, SessionService, LiveSessionRepository],
	exports: [SessionService, LiveSessionRepository]
})
export class SessionModule {}
