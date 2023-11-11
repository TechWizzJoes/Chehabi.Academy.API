import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { AccountController } from '@App/Features/Account/Account.Controller';
import { EmailSenderService } from '@App/Features/EmailSender/EmailSender.Service';
import { EmailSenderRepository } from './EmailSender.Repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@App/Data/TypeOrmEntities/User';
import { EmailSenderController } from './EmailSender.Controller';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [EmailSenderController],
	providers: [AppConfig, EmailSenderService, EmailSenderRepository]
})
export class EmailSenderModule {}
