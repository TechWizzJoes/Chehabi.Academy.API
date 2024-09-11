// UserRepository
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModels } from './User.Models';
import { User } from '@App/Data/TypeOrmEntities/User';
import { UserCourse } from '@App/Data/TypeOrmEntities/UserCourse';
import { UserClass } from '@App/Data/TypeOrmEntities/UserClass';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(UserCourse)
		private userCourseRepository: Repository<UserCourse>,
		@InjectRepository(UserClass)
		private userClassRepository: Repository<UserClass>
	) {}

	async GetById(id: number): Promise<User> {
		return this.userRepository.findOne({
			where: {
				Id: id
			}
		});
	}

	async UpdateUser(user: UserModels.UserResModel): Promise<User> {
		return await this.userRepository.save(user);
	}

	async AddUserToClass(userId: number, classId: number, IsPaid: boolean): Promise<UserClass> {
		const newUserClass = new UserClass();
		newUserClass.UserId = userId;
		newUserClass.ClassId = classId;
		newUserClass.IsPaid = IsPaid;
		const userClassEntity = await this.userClassRepository.upsert(newUserClass, ['UserId', 'ClassId']);
		return userClassEntity.generatedMaps[0] as UserClass;
	}
}
