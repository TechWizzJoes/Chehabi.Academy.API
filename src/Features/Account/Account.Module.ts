import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { AccountController } from '@App/Features/Account/Account.Controller';
import { AccountService } from '@App/Features/Account/Account.Service';
import { AccountRepository } from './Account.Repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entities/User.Entity';

const Entities = [User];
@Module({
	imports: [CommonModule, TypeOrmModule.forFeature(Entities)],
	controllers: [AccountController],
	providers: [AppConfig, AccountService, AccountRepository]
})
export class AccountModule { }
