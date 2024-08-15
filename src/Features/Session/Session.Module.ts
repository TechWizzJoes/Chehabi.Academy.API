import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { LiveSessionRepository } from './Session.Repository';
import { SessionController } from './Session.Controller';
import { SessionService } from './Session.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [SessionController],
	providers: [AppConfig, SessionService, LiveSessionRepository]
})
export class SessionModule {}
