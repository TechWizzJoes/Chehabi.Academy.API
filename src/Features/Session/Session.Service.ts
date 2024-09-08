import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { LiveSessionRepository } from './Session.Repository';
import { LiveSessionModels } from './Session.Models';
import { promises } from 'dns';

@Injectable()
export class SessionService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private LiveSessionRepository: LiveSessionRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	// async GetById(id): Promise<SessionModels.MasterModel> {
	// 	return this.LiveSessionRepository.GetById(id);
	// }

	async GetallByClassId(classId: number): Promise<LiveSessionModels.MasterModel[]> {
		return this.LiveSessionRepository.GetallByClassId(classId);
	}

	async Create(course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Create(course);
	}

	async BulkCreate(sessions: LiveSessionModels.SessionReqModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkCreate(sessions);
	}

	async Update(id, course: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return await this.LiveSessionRepository.Update(id, course);
	}

	async BulkUpdate(sessions: LiveSessionModels.MasterModel[]): Promise<LiveSessionModels.MasterModel[]> {
		return await this.LiveSessionRepository.BulkUpdate(sessions);
	}

	async Delete(id: number): Promise<void> {
		return await this.LiveSessionRepository.Delete(id);
	}

	async GetNextHourSessions(): Promise<LiveSessionModels.MasterModel[]> {
		// Get the start and end of today's date in local time
		const today = new Date();
		const startOfDay = new Date(today.setHours(0, 0, 0, 0));
		const endOfDay = new Date(today.setHours(23, 59, 59, 999));
		// const todaysSessions = sessions.filter(s => s.StartDate >= startOfDay && s.StartDate <= endOfDay);

		// Get the start and end of the current hour in local time
		const now = new Date();
		const startOfCurrentHour = new Date(now.setMinutes(0, 0, 0));

		const startOfHour = new Date(startOfCurrentHour.getTime() + 60 * 60 * 1000);
		const endOfHour = new Date(startOfCurrentHour.getTime() + 2 * 60 * 60 * 1000);
		// Get the start and end of the current hour in UTC
		// const startOfHour = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),0, 0, 0 ));
		// const endOfHour = new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate(),now.getUTCHours(),59, 59, 999);

		return await this.LiveSessionRepository.GetCustomHourSessions(startOfHour, endOfHour);
	}

	async GetPreviousHourSessions(): Promise<LiveSessionModels.MasterModel[]> {
		const now = new Date();
		const startOfCurrentHour = new Date(now.setMinutes(0, 0, 0));
		// Calculate the start of the previous hour
		// const previousMonth = 30 * 24 * 60 * 60 * 1000; // for local testing
		const previousHour = 60 * 60 * 1000;
		const startOfPreviousHour = new Date(startOfCurrentHour.getTime() - previousHour); // Subtract one hour
		// Calculate the end of the previous hour
		const endOfPreviousHour = new Date(startOfCurrentHour.getTime() - 1); // End of previous hour is the last moment of the previous hour

		return await this.LiveSessionRepository.GetCustomHourSessions(startOfPreviousHour, endOfPreviousHour);
	}
}
