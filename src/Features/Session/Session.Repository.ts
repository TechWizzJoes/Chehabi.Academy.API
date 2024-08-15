import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveSessionModels } from './Session.Models';
import { LiveSession } from '@App/Data/TypeOrmEntities/LiveSession';

@Injectable()
export class LiveSessionRepository {
	constructor(
		@InjectRepository(LiveSession)
		private SessionRepository: Repository<LiveSession>
	) {}

	async GetallByClassId(classId: number): Promise<LiveSession[]> {
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

	async Create(SessionData: Partial<LiveSession>): Promise<LiveSession> {
		const newSession = this.SessionRepository.create({
			...SessionData
		});
		return await this.SessionRepository.save(newSession);
	}

	async Update(id: number, classData: LiveSessionModels.SessionReqModel): Promise<LiveSession> {
		let updateSession: LiveSession = await this.SessionRepository.findOne({
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
