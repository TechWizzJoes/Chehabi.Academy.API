import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { ClassRepository } from './Class.Repository';
import { ClassModels } from './Class.Models';
import { promises } from 'dns';
import { UserService } from '../User/User.Service';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { CoursesService } from '../Courses/Courses.Service';

@Injectable()
export class ClassService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private ClassRepository: ClassRepository,
		private UserService: UserService,
		private CoursesService: CoursesService,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetallByClassId(id: number): Promise<ClassModels.MasterModel[]> {
		return this.ClassRepository.GetallByClassId(id);
	}

	async GetById(id: number): Promise<ClassModels.MasterModel> {
		return this.ClassRepository.GetById(id);
	}

	async Create(newClass: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		newClass.IsActive = newClass.IsActive ?? true;
		newClass.IsDeleted = false;
		return await this.ClassRepository.Create(newClass);
	}

	async Update(id, course: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Update(id, course);
	}

	async Delete(id): Promise<ClassModels.MasterModel> {
		return await this.ClassRepository.Delete(id);
	}

	async JoinClass(classId: number): Promise<any> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const selectedClass: ClassModels.MasterModel = await this.GetById(classId);
		const selectedCourse: CoursesModels.MasterModel = await this.CoursesService.GetById(selectedClass.CourseId);

		const userExistsInClass =
			selectedCourse.Classes.filter((c) => {
				let userIdsInClass = [];
				if (c.IsActive) {
					userIdsInClass = c.Users?.map((u) => u.Id);
				}
				return userIdsInClass.includes(CurrentUser.UserId);
			}).length > 0;

		if (!selectedClass) throw new NotFoundException();
		if (selectedClass.Users.length >= selectedClass.MaxCapacity)
			throw new HttpException(ErrorCodesEnum.MAX_CLASS_USERS, HttpStatus.BAD_REQUEST);
		if (selectedClass.Users.find((c) => c.Id == CurrentUser.UserId))
			throw new HttpException(ErrorCodesEnum.USER_EXISTS_CLASS, HttpStatus.BAD_REQUEST);
		if (userExistsInClass) throw new HttpException(ErrorCodesEnum.USER_EXISTS_COURSE, HttpStatus.BAD_REQUEST);

		const user: UserModels.MasterModel = await this.UserService.GetById(CurrentUser.UserId);
		user.Classes.push(selectedClass);
		let updatedUser = await this.UserService.SaveUser(user);
		return updatedUser;
	}
}
