import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { UserRepository } from './User.Repository';
import { UserController } from './User.Controller';
import { UserService } from './User.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [UserController],
	providers: [AppConfig, UserService, UserRepository],
	exports: [UserService, UserRepository]
})
export class UserModule {}
