import { Module } from '@nestjs/common';

import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { User } from './TypeOrmEntities/User';
import { Feedback } from './TypeOrmEntities/Feedback';
import { Class } from './TypeOrmEntities/Class';
import { Course } from './TypeOrmEntities/Course';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSubscriptions } from './TypeOrmEntities/NotificationSubscriptions';

const Entities = [User, Feedback, Class, Course, NotificationSubscriptions];

@Module({
	imports: [CommonModule, TypeOrmModule.forFeature(Entities)],
	providers: [AppConfig],
	exports: [TypeOrmModule.forFeature(Entities)] //to use entities outside of the module
})
export class DataModule {}
