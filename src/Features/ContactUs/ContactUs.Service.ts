import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { ContactUsRepository } from './ContactUs.Repository';
import { ContactUsModels } from './ContactUs.Models';
import { NotificationsService } from '../-Notifications/Notifications.Service';
import { NotificationTemplateKey } from '../-Notifications/NotificationTemplateKey';

@Injectable()
export class ContactUsService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private ContactUsRepository: ContactUsRepository,
		private NotificationsService: NotificationsService
	) {
		this.Config = this.appConfig.Config;
	}

	async Create(reqModel: ContactUsModels.ContactUsReqModel): Promise<ContactUsModels.MasterModel> {
		// notify us
		// this.NotificationsService.NotifyUser(NotificationTemplateKey.CONTACT_US, {
		// 	User: 'info@chehabi-academy.com',
		// 	Placeholders: {
		// 		FirstName: reqModel.FirstName,
		// 		LastName: reqModel.LastName,
		// 		Description: reqModel.Description
		// 	}
		// });

		// // reply to the user
		// this.NotificationsService.NotifyUser(NotificationTemplateKey.CONTACT_US_REPLY, {
		// 	User: reqModel.Email,
		// 	Placeholders: {
		// 		FirstName: reqModel.FirstName,
		// 		LastName: reqModel.LastName,
		// 		Description: reqModel.Description
		// 	}
		// });
		return await this.ContactUsRepository.Create(reqModel);
	}
}
