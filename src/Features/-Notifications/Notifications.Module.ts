import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { NotificationsController } from '@App/Features/-Notifications/Notifications.Controller';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { NotificationsRepository } from './Notifications.Repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [NotificationsController],
	providers: [AppConfig, NotificationsService, NotificationsRepository]
})
export class NotificationsModule {}
