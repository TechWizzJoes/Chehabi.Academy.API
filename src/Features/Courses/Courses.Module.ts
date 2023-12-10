import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { AccountController } from '@App/Features/Account/Account.Controller';
import { AccountService } from '@App/Features/Account/Account.Service';
import { CoursesRepository } from './Courses.Repository';
import { CoursesController } from './Courses.Controller';
import { CoursesService } from './Courses.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [CoursesController],
	providers: [AppConfig, CoursesService, CoursesRepository],
	exports: [CoursesService, CoursesRepository]
})
export class CoursesModule {}
