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

	constructor() {} // @InjectRepository(EmailSenderModels.EmailSender) private EmailSender: Repository<EmailSenderModels.EmailSender>,

	async sendEmail(mailOptions: nodemailer.SendMailOptions): Promise<string> {
		const transporter = nodemailer.createTransport({
			host: process.env.Email_Host,
			port: process.env.Email_Port, // Use 465 for SSL or 587 for TLS
			secure: true,
			auth: {
				user: process.env.Email_User,
				pass: process.env.Email_Password
			}
		});

		try {
			// Read the welcome email template
			const welcomeHtml = `
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
