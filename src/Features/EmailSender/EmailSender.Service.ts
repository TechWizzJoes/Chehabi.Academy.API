import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { EmailSenderRepository } from './EmailSender.Repository';
import { EmailSenderModels } from './EmailSender.Models';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';

@Injectable()
export class EmailSenderService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private EmailSenderRepository: EmailSenderRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async SendWelcomeMail(mailOptions: nodemailer.SendMailOptions) {
		return await this.EmailSenderRepository.sendEmail(mailOptions);
	}
}
