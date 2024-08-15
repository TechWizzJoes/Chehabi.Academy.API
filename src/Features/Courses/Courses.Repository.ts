import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { CoursesModels } from './Courses.Models';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { User } from '@App/Data/TypeOrmEntities/User';

@Injectable()
export class CoursesRepository {
	constructor(
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async GetAll(): Promise<Course[]> {
		return this.courseRepository.find({
			where: {
				IsDeleted: false,
				IsActive: true
			},
			relations: ['Instructor.User']
		});
	}

	async GetById(id: number): Promise<Course> {
		return this.courseRepository.findOne({
			where: {
				Id: id,
				IsDeleted: false
				// IsActive: true
			},
			relations: ['Instructor.User', 'Classes', 'Classes.LiveSessions', 'Classes.Users']
		});
	}

	async Create(courseData: CoursesModels.CoursesReqModel): Promise<Course> {
		const newCourse = this.courseRepository.create({
			...courseData
		});
		return await this.courseRepository.save(newCourse);
	}

	async Update(id: number, courseData: CoursesModels.CoursesReqModel): Promise<Course> {
		let updateCourse: Course = await this.courseRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateCourse) {
			// handle case where the course is not found
			return null;
		}

		updateCourse = {
			...updateCourse,
			...courseData
		};

		return await this.courseRepository.save(updateCourse);
	}

	async Delete(id: number): Promise<Course> {
		let deleteCourse: Course = await this.courseRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!deleteCourse) {
			// handle case where the course is not found
			return null;
		}

		deleteCourse.IsActive = false;
		deleteCourse.IsDeleted = true;

		return await this.courseRepository.save(deleteCourse);
	}

	async GetClasses(courseId: number): Promise<Class[]> {
		const courseEntity = await this.courseRepository.findOne({
			where: {
				Id: courseId,
				IsDeleted: false
			},
			relations: ['Classes']
		});

		return courseEntity.Classes;
	}

	async GetAdminCoursesByUserId(userId: number): Promise<Course[]> {
		const Classes = await this.courseRepository.find({
			where: {
				InstructorId: userId,
				IsDeleted: false
			},
			relations: ['Instructor.User']
		});

		return Classes;
	}

	async GetEnrolledClassesByUserId(userId: number): Promise<Class[]> {
		const user = await this.userRepository.findOne({
			where: {
				Id: userId,
				IsDeleted: false
			},
			select: {
				Classes: true
			},
			relations: ['Classes']
		});

		return user.Classes;
	}
}
