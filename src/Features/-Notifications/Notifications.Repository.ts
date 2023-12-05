import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
import { NotificationsModels } from './Notifications.Models';
import { NotificationSubscriptions } from '@App/Data/TypeOrmEntities/NotificationSubscriptions';
@Injectable()
export class NotificationsRepository {
	Config: Config;

	constructor(
		@InjectRepository(NotificationSubscriptions)
		private NotificationSubscriptions: Repository<NotificationSubscriptions>
	) {}

	async GetBySubObject(subObject: string): Promise<NotificationSubscriptions[]> {
		let sub = await this.NotificationSubscriptions.find({
			where: {
				Subscription: subObject
			}
		});
		return sub;
	}

	async AddSubscription(subObject: any): Promise<NotificationSubscriptions[]> {
		let sub = await this.NotificationSubscriptions.create(subObject);
		return await this.NotificationSubscriptions.save(sub);
	}

	async GetAll(): Promise<NotificationSubscriptions[]> {
		return this.NotificationSubscriptions.find();
	}
}
