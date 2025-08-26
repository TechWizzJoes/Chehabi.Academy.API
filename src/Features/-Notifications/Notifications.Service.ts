import { AppConfig, Config } from '@App/Config/App.Config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserHelper } from '../../Common/Helpers/CurrentUser.Helper';
import * as webpush from 'web-push';
import { log } from 'console';
import { NotificationsRepository } from './Notifications.Repository';
import { NotificationTemplateKey, NotificationTemplateType } from './NotificationTemplateKey';
import { NotificationModels } from './Notifications.Models';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as nodemailer from 'nodemailer';
import { NotificationsWebSocketGateway } from './WebsocketGateway';
import { AccountRepository } from '../Account/Account.Repository';
import { Constants } from '@App/Common/Constants';

@Injectable()
export class NotificationsService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private UserHelper: UserHelper,
		private NotificationsRepository: NotificationsRepository,
		private WebSocketGateway: NotificationsWebSocketGateway,
		private AccountRepository: AccountRepository
	) {
		this.Config = this.appConfig.Config;
		// webpush.setVapidDetails(
		// 	'mailto:example@yourdomain.org',
		// 	this.Config.Notification.PublicKey,
		// 	this.Config.Notification.PrivateKey
		// );
	}
	//#region push notifications
	// private notificationPayload = {
	// 	notification: {
	// 		title: 'Chehaby Academy',
	// 		body: '',
	// 		icon: 'assets/icons/favicon.png',
	// 		vibrate: [100, 50, 100],
	// 		data: {
	// 			dateOfArrival: Date.now(),
	// 			primaryKey: 1
	// 		},
	// 		actions: [
	// 			{
	// 				action: 'go',
	// 				title: 'Go to the site'
	// 			}
	// 		]
	// 	}
	// };

	// async SubscribeClient(subObject: any) {
	// 	const currentUser = this.UserHelper.GetCurrentUser();
	// 	const subObj = JSON.stringify(subObject);
	// 	let newObj = {
	// 		UserId: currentUser.UserId ?? 1,
	// 		Subscription: subObj
	// 	};
	// 	let subs = await this.NotificationsRepository.GetBySubObject(subObj);
	// 	if (subs.length > 0) return;
	// 	this.NotificationsRepository.AddSubscription(newObj);
	// }

	// async Publish() {
	// 	webpush.setVapidDetails(
	// 		'mailto:example@yourdomain.org',
	// 		this.Config.Notification.PublicKey,
	// 		this.Config.Notification.PrivateKey
	// 	);
	// 	const allSubscriptionsString = await this.NotificationsRepository.GetAll();

	// 	const allSubscriptions = allSubscriptionsString.map((string) => JSON.parse(string.Subscription));
	// 	console.log('Total subscriptions', allSubscriptions.length);

	// 	Promise.all(
	// 		allSubscriptions.map((sub) => webpush.sendNotification(sub, JSON.stringify(this.notificationPayload)))
	// 	)
	// 		.then(() => console.log('notification sent'))
	// 		.catch((err) => {
	// 			console.error('Error sending notification, reason: ', err);
	// 		});
	// }
	//#endregion

	private async getEmailStructureTemplate(lang: string): Promise<string> {
		const template = await this.NotificationsRepository.getTemplateByKeyAndType(
			NotificationTemplateKey.MAIN_TEMPLATE,
			lang,
			null
		);
		if (!template || !template.Template) {
			throw new ApplicationException(`${ErrorCodesEnum.Template_Not_Found}`, HttpStatus.BAD_REQUEST);
		}

		template.Template = template.Template.replace('{year}', Constants.GetYear());
		return template.Template;
	}

	private async getTemplate(key: string, lang: string, type: string): Promise<string> {
		const template = await this.NotificationsRepository.getTemplateByKeyAndType(key, lang, type);
		if (!template || !template.Template) {
			throw new ApplicationException(`${ErrorCodesEnum.Template_Not_Found}`, HttpStatus.BAD_REQUEST);
		}
		return template.Template;
	}

	async GetInApp(isRead?: boolean, page?: number) {
		const currentUser = this.UserHelper.GetCurrentUser();
		return this.NotificationsRepository.GetInAppNotificationByUserId(currentUser.UserId, isRead, page);
	}

	ReadItems(ids: number[]): Promise<any> {
		return this.NotificationsRepository.ReadItems(ids);
	}

	async NotifyUser(payload: NotificationModels.NotificationPayload): Promise<boolean> {
		//Using the mail notification in the payload is just for testing
		if (payload.Email !== undefined && payload.Email !== null) {
			payload.User = (await this.AccountRepository.GetUserByEmailForNotifications(payload.Email.toLowerCase().trim())) ?? null;
		}
		if (!payload.User && !payload.User.Email) {
			throw new ApplicationException(`${ErrorCodesEnum.USER_NOT_FOUND}`, HttpStatus.BAD_REQUEST);
		}

		// Check on template and type
		if (!Object.values(NotificationTemplateKey).includes(payload.Type)) {
			throw new ApplicationException(`${ErrorCodesEnum.Invalid_Notification_Type}`, HttpStatus.BAD_REQUEST);
		}

		switch (payload.Type) {
			case NotificationTemplateKey.SESSION_REMINDER_USER:
			case NotificationTemplateKey.SESSION_REMINDER_INSTRUCTOR:
				if (payload.User.UserPrefrence.SessionsReminderNotify) {
					await this.sendAppNotification(payload);
					this.sendEmail(payload);
				}
				break;

			case NotificationTemplateKey.CONTACT_US:
			case NotificationTemplateKey.CONTACT_US_REPLY:
				await this.sendEmail(payload);
				break;

			case NotificationTemplateKey.PAYMENT_SUCCESS:
				await this.sendAppNotification(payload);
				await this.sendEmail(payload);
				break;
			case NotificationTemplateKey.WELCOME_EMAIL:
				await this.sendEmail(payload);
				break;
			default:
				break;
		}

		return true;
	}

	replaceTemplatePlaceholders(payload: NotificationModels.NotificationPayload, template: string) {
		for (const [key, value] of Object.entries(payload.Placeholders)) {
			const placeholder = `{{${key}}}`;
			template = template.replace(new RegExp(placeholder, 'g'), value);
		}
		return template;
	}

	async sendEmail(payload: NotificationModels.NotificationPayload): Promise<boolean> {
		let emailStructure = await this.getEmailStructureTemplate(payload.User.UserPrefrence.PreferredLanguage);
		let template = await this.getTemplate(payload.Type, payload.User.UserPrefrence.PreferredLanguage, NotificationTemplateType.EMAIL);

		template = this.replaceTemplatePlaceholders(payload, template);
		emailStructure = emailStructure !== null ? emailStructure.replace('{0}', template) : template;

		const mailOptions = {
			from: process.env.Email_NoReply_User,
			to: payload.Email ?? payload.User.Email,
			subject: payload.Type.replace(/_/g, ' ').toUpperCase(),
			html: emailStructure
		};

		const transporter = nodemailer.createTransport({
			host: process.env.Email_Host,
			port: process.env.Email_Port,
			secure: true,
			auth: {
				user: process.env.Email_NoReply_User,
				pass: process.env.Email_Password
			}
		});

		//  ***************************
		// log the mail sending
		try {
			const info = await transporter.sendMail(mailOptions);
			return true;
		} catch (error) {
			throw new ApplicationException(`${ErrorCodesEnum.EMAIL_NOT_Sent} ${error}`, HttpStatus.BAD_REQUEST);
		}
	}

	async sendAppNotification(payload: NotificationModels.NotificationPayload): Promise<boolean> {
		let template = await this.getTemplate(payload.Type, payload.User.UserPrefrence.PreferredLanguage, NotificationTemplateType.IN_APP);
		template = this.replaceTemplatePlaceholders(payload, template);

		let newNotification = {
			UserId: payload.User.Id,
			Text: template
		} as NotificationModels.InApp;

		const notification = await this.NotificationsRepository.SaveInAppNotification(newNotification);
		await this.WebSocketGateway.notifyUser(payload.User.Id, notification);
		return true;
	}
}
