import { HttpStatus, Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
import { NotificationsModels } from './Notifications.Models';
import { NotificationSubscriptions } from '@App/Data/TypeOrmEntities/NotificationSubscriptions';
import { NotificationTemplate } from '@App/Data/TypeOrmEntities/NotificationTemplate';
import * as nodemailer from 'nodemailer';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
@Injectable()
export class NotificationsRepository {
	Config: Config;

	constructor(
		@InjectRepository(NotificationSubscriptions)
		private NotificationSubscriptions: Repository<NotificationSubscriptions>,

		@InjectRepository(NotificationTemplate)
		private NotificationTemplates: Repository<NotificationTemplate>
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

	// notification template
	async getTemplateByKey(key: string): Promise<NotificationTemplate | null> {
		return this.NotificationTemplates.findOne({ where: { Key: key } });
	}

	async sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<string> {
		const transporter = nodemailer.createTransport({
			host: process.env.Email_Host,
			port: process.env.Email_Port,
			secure: true,
			auth: {
				user: process.env.Email_User,
				pass: process.env.Email_Password
			}
		});

		try {
			const info = await transporter.sendMail(mailOptions);
			return `Email sent: ${info.response}`;
		} catch (error) {
			throw new ApplicationException(`${ErrorCodesEnum.EMAIL_NOT_Sent} ${error}`, HttpStatus.BAD_REQUEST);
		}
	}
}
