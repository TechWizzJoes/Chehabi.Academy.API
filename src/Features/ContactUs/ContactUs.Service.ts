import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { ContactUsRepository } from './ContactUs.Repository';
import { ContactUsModels } from './ContactUs.Models';
import { NotificationsService } from '../-Notifications/Notifications.Service';
import { NotificationTemplateKey } from '../-Notifications/NotificationTemplateKey';
import { UserModels } from '../User/User.Models';
import { NotificationModels } from '../-Notifications/Notifications.Models';

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
		try {
			await this.SendUsMail(reqModel);
			reqModel.IsSentToUs = true;
		} catch (error) {}
		try {
			await this.SendUserMail(reqModel);
			reqModel.IsSentToUser = true;
		} catch (error) {}
		return await this.ContactUsRepository.Create(reqModel);
	}

	private async SendUsMail(reqModel: ContactUsModels.ContactUsReqModel) {
		const ourUser = new UserModels.MasterModel();
		ourUser.Email = 'info@chehabi-academy.com';

		const payload = new NotificationModels.NotificationPayload();
		payload.User = ourUser;
		payload.Type = NotificationTemplateKey.CONTACT_US_REPLY;
		payload.Placeholders = {
			FirstName: reqModel.FirstName,
			LastName: reqModel.LastName,
			Email: reqModel.Email,
			Description: reqModel.Description
		};
		await this.NotificationsService.NotifyUser(payload);
	}

	private async SendUserMail(reqModel: ContactUsModels.ContactUsReqModel) {
		const userContactingUs = new UserModels.MasterModel();
		userContactingUs.Email = reqModel.Email;

		const payload = new NotificationModels.NotificationPayload();
		payload.User = userContactingUs;
		payload.Type = NotificationTemplateKey.CONTACT_US;
		payload.Placeholders = {
			FirstName: reqModel.FirstName,
			LastName: reqModel.LastName,
			Email: reqModel.Email,
			Description: reqModel.Description
		};
		await this.NotificationsService.NotifyUser(payload);
	}
}
