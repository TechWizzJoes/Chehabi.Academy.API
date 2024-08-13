import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '@App/Data/TypeOrmEntities/Session';
import { SessionModels } from './Session.Models';

@Injectable()
export class SessionRepository {
	constructor(
		@InjectRepository(Session)
		private SessionRepository: Repository<Session>
	) {}

	async GetallByClassId(classId: number): Promise<Session[]> {
		return this.SessionRepository.find({
			where: {
				ClassId: classId
			}
		});
	}

	// async GetByClassIdAndOccurance(classId: number, occurance: string): Promise<Session> {
	// 	return this.SessionRepository.findOne({
	// 		where: {
	// 			ClassId: classId,
	// 			Occurance: occurance
	// 		}
	// 	});
	// }

	async Create(SessionData: Partial<Session>): Promise<Session> {
		const newSession = this.SessionRepository.create({
			...SessionData
		});
		return await this.SessionRepository.save(newSession);
	}

	async Update(id: number, classData: SessionModels.SessionReqModel): Promise<Session> {
		let updateSession: Session = await this.SessionRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateSession) {
			// handle case where the class is not found
			return null;
		}

		updateSession = {
			...updateSession,
			...classData
		};

		return await this.SessionRepository.save(updateSession);
	}

	async Delete(id: number): Promise<void> {
		await this.SessionRepository.delete({
			Id: id
		});
	}
}
