import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { AccountController } from '@App/Features/Account/Account.Controller';
import { AccountService } from '@App/Features/Account/Account.Service';
import { RatingRepository } from './Rating.Repository';
import { RatingController } from './Rating.Controller';
import { RatingService } from './Rating.Service';
import { CoursesService } from '../Courses/Courses.Service';
import { CoursesRepository } from '../Courses/Courses.Repository';
import { CoursesModule } from '../Courses/Courses.Module';

@Module({
	imports: [DataModule, CommonModule, CoursesModule],
	controllers: [RatingController],
	providers: [AppConfig, RatingService, RatingRepository, CoursesService, CoursesRepository],
	exports: [RatingService, RatingRepository]
})
export class RatingModule {}
