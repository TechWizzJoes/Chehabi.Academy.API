import { AppConfig, Config } from '@App/Config/App.Config';
import { Injectable } from '@nestjs/common';
import { UserHelper } from '../../Common/Helpers/CurrentUser.Helper';
import * as webpush from 'web-push';
import { log } from 'console';
import { NotificationsRepository } from './Notifications.Repository';

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
			icon: 'assets/Images/full-logo.png',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: 1
			},
			actions: [
				{
					action: 'explore',
					title: 'Go to the site'
				},
				{
					action: 'openChat',
					title: 'open conv'
				}
			]
		}
	};

	async SubscribeClient(subObject: any) {
		const currentUser = this.UserHelper.GetCurrentUser();
		let newObj = {
			UserId: currentUser.UserId ?? 1,
			Subscription: JSON.stringify(subObject)
		};
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
}
