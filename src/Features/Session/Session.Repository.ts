import { Injectable } from '@nestjs/common';
import { Between, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LiveSessionModels } from './Session.Models';
import { LiveSession } from '@App/Data/TypeOrmEntities/LiveSession';
import { UserClass } from '@App/Data/TypeOrmEntities/UserClass';

@Injectable()
export class LiveSessionRepository {
	constructor(
		@InjectRepository(LiveSession)
		private SessionRepository: Repository<LiveSession>,
		@InjectRepository(UserClass)
		private userClassRepository: Repository<UserClass>
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

	async BulkCreate(sessions: Partial<LiveSession>[]): Promise<LiveSession[]> {
		const newSession = this.SessionRepository.create([...sessions]);
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

	async BulkUpdate(sessions: LiveSessionModels.MasterModel[]): Promise<LiveSession[]> {
		return await this.SessionRepository.save(sessions);
	}

	async Delete(id: number): Promise<void> {
		await this.SessionRepository.delete({
			Id: id
		});
	}

	async GetClassesIdsByUserId(userId: number): Promise<UserClass[]> {
		return this.userClassRepository.find({
			where: {
				UserId: userId,
				Class: {
					IsActive: true,
					IsDeleted: false
				}
			}
		});
	}

	async GetCustomHourSessions(
		startOfHour: Date,
		endOfHour: Date,
		classesIds?: number[],
		relations?: string[]
	): Promise<LiveSession[]> {
		const where: any = {
			StartDate: Between(startOfHour, endOfHour),
			Class: {
				IsActive: true,
				IsDeleted: false
			}
		};

		if (classesIds && classesIds.length > 0) {
			where.ClassId = In(classesIds);
		}

		return this.SessionRepository.find({
			where,
			order: { StartDate: 'ASC' },
			relations: relations ?? ['Class', 'Class.UserClasses.User', 'Class.Course.Instructor']
		});
	}
}
