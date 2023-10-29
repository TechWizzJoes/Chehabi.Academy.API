import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
import { EmailSenderModels } from './EmailSender.Models';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailSenderRepository {
	Config: Config;

	constructor() // @InjectRepository(EmailSenderModels.EmailSender) private EmailSender: Repository<EmailSenderModels.EmailSender>,
	{}

	async sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<string> {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'techwizzjoes@gmail.com',
				pass: 'rbyo phlw yjaj bwro'
			}
		});

		try {
			// Read the welcome email template
			const welcomeHtml = `
		  <h1>Welcome to Our Website</h1>
		  <p>Thank you for joining our community!</p>`;

			// Add HTML content to the mailOptions
			mailOptions.html += welcomeHtml;

			const info = await transporter.sendMail(mailOptions);
			return `Email sent: ${info.response}`;
		} catch (error) {
			throw new Error(`Email not sent: ${error}`);
		}
	}
}
