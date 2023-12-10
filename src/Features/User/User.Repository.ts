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
		private userRepository: Repository<User>
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
}
