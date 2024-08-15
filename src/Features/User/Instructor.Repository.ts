import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InstructorModels } from './Instructor.Models';
import { Instructor } from '@App/Data/TypeOrmEntities/Instructor';

@Injectable()
export class InstructorRepository {
	constructor(
		@InjectRepository(Instructor)
		private InstructorRepository: Repository<Instructor>
	) {}

	async GetByUserId(id: number): Promise<Instructor> {
		return this.InstructorRepository.findOne({
			where: {
				UserId: id
			}
		});
	}
}
