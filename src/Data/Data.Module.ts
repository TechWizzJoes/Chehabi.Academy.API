import { Module } from '@nestjs/common';

import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { User } from './TypeOrmEntities/User';
import { Feedback } from './TypeOrmEntities/Feedback';
import { Class } from './TypeOrmEntities/Class';
import { Course } from './TypeOrmEntities/Course';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSubscriptions } from './TypeOrmEntities/NotificationSubscriptions';
import { WhatsNew } from './TypeOrmEntities/WhatsNew';
import { LiveSession } from './TypeOrmEntities/LiveSession';
import { RecordedSession } from './TypeOrmEntities/RecordedSession';
import { CourseType } from './TypeOrmEntities/CourseType';
import { Instructor } from './TypeOrmEntities/Instructor';
import { NotificationTemplate } from './TypeOrmEntities/NotificationTemplate';

const Entities = [
	User,
	Feedback,
	Class,
	Course,
	LiveSession,
	RecordedSession,
	WhatsNew,
	NotificationSubscriptions,
	CourseType,
	Instructor,
	NotificationTemplate
];

@Module({
	imports: [CommonModule, TypeOrmModule.forFeature(Entities)],
	providers: [AppConfig],
	exports: [TypeOrmModule.forFeature(Entities)] //to use entities outside of the module
})
export class DataModule {}
