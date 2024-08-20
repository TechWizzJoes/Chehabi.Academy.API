// ClassRepository
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { User } from '@App/Data/TypeOrmEntities/User';
import { ClassModels } from './Class.Models';
import { Course } from '@App/Data/TypeOrmEntities/Course';

@Injectable()
export class ClassRepository {
	constructor(
		@InjectRepository(Class)
		private classRepository: Repository<Class>,
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async GetEnrolledClassesByUserId(userId: number): Promise<Class[]> {
		const user = await this.userRepository.findOne({
			where: {
				Id: userId,
				IsDeleted: false
			},
			select: {
				Classes: true
			},
			relations: [
				'Classes',
				'Classes.Users',
				'Classes.Course',
				'Classes.LiveSessions',
				'Classes.Course.Instructor.User'
			]
			// relations: ['Users', 'Course','LiveSessions', 'Course.Instructor']
		});

		return user.Classes;
	}

	async GetById(id: number): Promise<Class> {
		return this.classRepository.findOne({
			relations: ['Users', 'Course', 'Course.Classes', 'LiveSessions'],
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

	async GetUsers(classId: number): Promise<User[]> {
		const classEntity = await this.classRepository.findOne({
			where: {
				Id: classId
			},
			relations: ['Users']
		});

		return classEntity.Users;
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
}
