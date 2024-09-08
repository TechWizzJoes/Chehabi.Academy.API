import { AppConfig, Config } from '@App/Config/App.Config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserHelper } from '../../Common/Helpers/CurrentUser.Helper';
import * as webpush from 'web-push';
import { log } from 'console';
import { NotificationsRepository } from './Notifications.Repository';
import { NotificationTemplateKey } from './NotificationTemplateKey';
import { NotificationsModels } from './Notifications.Models';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class NotificationsService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private UserHelper: UserHelper,
		private NotificationsRepository: NotificationsRepository
	) {
		this.Config = this.appConfig.Config;
		webpush.setVapidDetails(
			'mailto:example@yourdomain.org',
			this.Config.Notification.PublicKey,
			this.Config.Notification.PrivateKey
		);
	}

	private notificationPayload = {
		notification: {
			title: 'Chehaby Academy',
			body: '',
			icon: 'assets/icons/favicon.png',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1
			},
			actions: [
				{
					action: 'go',
					title: 'Go to the site'
				}
			]
		}
	};

	async SubscribeClient(subObject: any) {
		const currentUser = this.UserHelper.GetCurrentUser();
		const subObj = JSON.stringify(subObject);
		let newObj = {
			UserId: currentUser.UserId ?? 1,
			Subscription: subObj
		};
		let subs = await this.NotificationsRepository.GetBySubObject(subObj);
		if (subs.length > 0) return;
		this.NotificationsRepository.AddSubscription(newObj);
	}

	async Publish() {
		webpush.setVapidDetails(
			'mailto:example@yourdomain.org',
			this.Config.Notification.PublicKey,
			this.Config.Notification.PrivateKey
		);
		const allSubscriptionsString = await this.NotificationsRepository.GetAll();

		const allSubscriptions = allSubscriptionsString.map((string) => JSON.parse(string.Subscription));
		console.log('Total subscriptions', allSubscriptions.length);

		Promise.all(
			allSubscriptions.map((sub) => webpush.sendNotification(sub, JSON.stringify(this.notificationPayload)))
		)
			.then(() => console.log('notification sent'))
			.catch((err) => {
				console.error('Error sending notification, reason: ', err);
			});
	}

	private getSvgLogo(): string {
		const svgPath = join(__dirname, '..', '..', '..', 'uploads', 'images', 'Logo', 'full-logo.svg');
		return readFileSync(svgPath, 'utf-8');
	}
	async sendNotificationEmail(type: string, payload: NotificationsModels.NotificationPayload): Promise<any> {
		// Check if the type is valid
		if (!Object.values(NotificationTemplateKey.Email).includes(type)) {
			throw new ApplicationException(`${ErrorCodesEnum.Invalid_Notification_Type}`, HttpStatus.BAD_REQUEST);
		}

		// Fetch the template from the database
		const template = await this.NotificationsRepository.getTemplateByKey(type);

		if (!template || !template.Template) {
			throw new ApplicationException(`${ErrorCodesEnum.Template_Not_Found}`, HttpStatus.BAD_REQUEST);
		}
		const svgLogo = this.getSvgLogo();
		let htmlTemplate = template.Template;

		// Replace placeholders in the template with values from payload
		for (const [key, value] of Object.entries(payload.Placeholders)) {
			const placeholder = `{{${key}}}`;
			htmlTemplate = htmlTemplate.replace(new RegExp(placeholder, 'g'), value);
		}
		htmlTemplate = htmlTemplate.replace('{{Logo}}', svgLogo);

		const mailOptions = {
			from: 'info@chehabi-academy.com',
			to: payload.Email,
			subject: type.replace(/_/g, ' ').toUpperCase(),
			html: htmlTemplate
		};

		return this.NotificationsRepository.sendEmail(mailOptions);
	}
}
