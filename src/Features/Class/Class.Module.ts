import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { ClassRepository } from './Class.Repository';
import { ClassController } from './Class.Controller';
import { ClassService } from './Class.Service';
import { UserService } from '../User/User.Service';
import { UserModule } from '../User/User.Module';
import { CoursesModule } from '../Courses/Courses.Module';
import { SessionModule } from '../Session/Session.Module';

@Module({
	imports: [DataModule, CommonModule, UserModule, CoursesModule, SessionModule],
	controllers: [ClassController],
	providers: [AppConfig, ClassService, ClassRepository],
	exports: [ClassService, ClassRepository]
})
export class ClassModule {}
