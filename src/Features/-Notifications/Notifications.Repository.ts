import { HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationSubscriptions } from '@App/Data/TypeOrmEntities/NotificationSubscriptions';
import { NotificationTemplate } from '@App/Data/TypeOrmEntities/NotificationTemplate';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { NotificationModels } from './Notifications.Models';
import { InAppNotification } from '@App/Data/TypeOrmEntities/InAppNotification';
@Injectable()
export class NotificationsRepository {
	Config: Config;

	constructor(
		@InjectRepository(NotificationSubscriptions)
		private NotificationSubscriptions: Repository<NotificationSubscriptions>,

		@InjectRepository(NotificationTemplate)
		private NotificationTemplates: Repository<NotificationTemplate>,
		@InjectRepository(InAppNotification)
		private InAppNotification: Repository<InAppNotification>
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

	async getTemplateByKeyAndType(key: string, type: string): Promise<NotificationTemplate | null> {
		return this.NotificationTemplates.findOne({ where: { Key: key, Type: type } });
	}

	async SaveInAppNotification(createDto: NotificationModels.InApp): Promise<InAppNotification> {
		const newNotification = this.InAppNotification.create({
			...createDto
		});
		return await this.InAppNotification.save(newNotification);
	}

	async GetInAppNotificationByUserId(userId: number, isRead?: boolean): Promise<InAppNotification[]> {
		const where = {
			UserId: userId
		} as any;

		if (isRead) {
			where.IsRead = isRead;
		}

		return await this.InAppNotification.find({
			where,
			take: 11,
			order: {
				CreatedOn: 'DESC'
			}
		});
	}
}
