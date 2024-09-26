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
import { Cart } from './TypeOrmEntities/Cart';
import { CartItem } from './TypeOrmEntities/CartItem';
import { UserClass } from './TypeOrmEntities/UserClass';
import { UserCourse } from './TypeOrmEntities/UserCourse';
import { Rating } from './TypeOrmEntities/Rating';
import { UserPrefrence } from './TypeOrmEntities/UserPrefrence';

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
	NotificationTemplate,
	Cart,
	CartItem,
	UserCourse,
	UserClass,
	Rating,
	UserPrefrence
];

@Module({
	imports: [CommonModule, TypeOrmModule.forFeature(Entities)],
	providers: [AppConfig],
	exports: [TypeOrmModule.forFeature(Entities)] //to use entities outside of the module
})
export class DataModule {}
