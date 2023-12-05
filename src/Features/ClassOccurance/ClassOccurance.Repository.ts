import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassOccurance } from '@App/Data/TypeOrmEntities/ClassOccurance';
import { ClassOccuranceModels } from './ClassOccurance.Models';

@Injectable()
export class ClassOccuranceRepository {
	constructor(
		@InjectRepository(ClassOccurance)
		private classOccuranceRepository: Repository<ClassOccurance>
	) {}

	async GetallByClassId(classId: number): Promise<ClassOccurance[]> {
		return this.classOccuranceRepository.find({
			where: {
				ClassId: classId
			}
		});
	}

	// async GetByClassIdAndOccurance(classId: number, occurance: string): Promise<ClassOccurance> {
	// 	return this.classOccuranceRepository.findOne({
	// 		where: {
	// 			ClassId: classId,
	// 			Occurance: occurance
	// 		}
	// 	});
	// }

	async Create(classOccuranceData: Partial<ClassOccurance>): Promise<ClassOccurance> {
		const newClassOccurance = this.classOccuranceRepository.create({
			...classOccuranceData
		});
		return await this.classOccuranceRepository.save(newClassOccurance);
	}

	async Update(id: number, classData: ClassOccuranceModels.ClassOccuranceReqModel): Promise<ClassOccurance> {
		let updateClassOccurance: ClassOccurance = await this.classOccuranceRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateClassOccurance) {
			// handle case where the class is not found
			return null;
		}

		updateClassOccurance = {
			...updateClassOccurance,
			...classData
		};

		return await this.classOccuranceRepository.save(updateClassOccurance);
	}

	async Delete(id: number): Promise<void> {
		await this.classOccuranceRepository.delete({
			Id: id
		});
	}
}
