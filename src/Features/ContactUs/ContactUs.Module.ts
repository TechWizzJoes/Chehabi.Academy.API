import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { ContactUsRepository } from './ContactUs.Repository';
import { ContactUsController } from './ContactUs.Controller';
import { ContactUsService } from './ContactUs.Service';
import { NotificationsModule } from '../-Notifications/Notifications.Module';

@Module({
	imports: [DataModule, CommonModule, NotificationsModule],
	controllers: [ContactUsController],
	providers: [AppConfig, ContactUsService, ContactUsRepository],
	exports: [ContactUsService, ContactUsRepository]
})
export class ContactUsModule {}
