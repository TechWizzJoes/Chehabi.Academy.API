// ClassRepository
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { User } from '@App/Data/TypeOrmEntities/User';
import { ClassModels } from './Class.Models';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { UserClass } from '@App/Data/TypeOrmEntities/UserClass';

@Injectable()
export class ClassRepository {
	constructor(
		@InjectRepository(Class)
		private classRepository: Repository<Class>,
		@InjectRepository(UserClass)
		private userClassRepository: Repository<UserClass>
	) {}

	async GetEnrolledClassesByUserId(userId: number): Promise<UserClass[]> {
		const userClasses = await this.userClassRepository.find({
			where: {
				UserId: userId,
				Class: {
					// IsActive:true,//to get completed
					IsDeleted: false
				}
			},
			relations: [
				'Class',
				// 'Class.Users',
				'Class.LiveSessions',
				'Class.Course.Instructor.User'
			]
		});

		return userClasses;
	}

	async GetById(id: number): Promise<Class> {
		return this.classRepository.findOne({
			relations: ['UserClasses', 'UserClasses.User', 'LiveSessions', 'Course', 'Course.Classes'],
			where: {
				Id: id
			}
		});
	}

	async Create(classData: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		const newClass = this.classRepository.create({
			...classData,
			IsActive: true,
			IsDeleted: false
		});
		return await this.classRepository.save(newClass);
	}

	async Update(id: number, classData: ClassModels.ClassReqModel): Promise<Class> {
		let updateClass: Class = await this.classRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateClass) {
			// handle case where the class is not found
			return null;
		}

		updateClass = {
			...updateClass,
			...classData
		};

		return await this.classRepository.save(updateClass);
	}

	async Delete(id: number): Promise<Class> {
		let deleteClass: Class = await this.classRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!deleteClass) {
			// handle case where the class is not found
			return null;
		}

		deleteClass.IsActive = false;
		deleteClass.IsDeleted = true;

		return await this.classRepository.save(deleteClass);
	}

	async GetUsers(classId: number): Promise<UserClass[]> {
		const userClasses = await this.userClassRepository.find({
			where: {
				ClassId: classId
			},
			relations: ['User']
		});

		return userClasses;
	}

	async GetCourse(classId: number): Promise<Course> {
		const classEntity = await this.classRepository.findOne({
			where: {
				Id: classId
			},
			relations: ['Course']
		});

		return classEntity.Course;
	}

	async GetByIds(ids: number[]): Promise<Class[]> {
		return this.classRepository.find({
			relations: ['LiveSessions'],
			where: {
				Id: In(ids)
			}
		});
	}

	async BulkUpdate(classes: ClassModels.MasterModel[]): Promise<Class[]> {
		let updateClasses: Class[] = await this.classRepository.save(classes);
		return updateClasses;
	}
}
