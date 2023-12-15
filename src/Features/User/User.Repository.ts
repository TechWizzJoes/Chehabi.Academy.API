// UserRepository
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModels } from './User.Models';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { User } from '@App/Data/TypeOrmEntities/User';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		@InjectRepository(Course)
		private courseRepository: Repository<Course>
	) {}

	async GetById(id: number): Promise<User> {
		return this.userRepository.findOne({
			relations: ['Classes'],
			where: {
				Id: id
			}
		});
	}

	async SaveUser(user: UserModels.MasterModel): Promise<User> {
		return await this.userRepository.save(user);
	}

	GetClassesInfo(UserId: number) {
		return this.courseRepository.find({
			where: {
				InstructorId: UserId,
				IsActive: true
			},
			relations: ['Classes', 'Classes.ClassOccurances', 'Classes.Users']
		});
	}
}
