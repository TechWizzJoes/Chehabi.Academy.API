import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { NotificationsController } from '@App/Features/-Notifications/Notifications.Controller';
import { NotificationsService } from '@App/Features/-Notifications/Notifications.Service';
import { NotificationsRepository } from './Notifications.Repository';
import { NotificationsWebSocketGateway } from './WebsocketGateway';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [NotificationsController],
	providers: [AppConfig, NotificationsService, NotificationsRepository, NotificationsWebSocketGateway],
	exports: [NotificationsWebSocketGateway]
})
export class NotificationsModule {}
