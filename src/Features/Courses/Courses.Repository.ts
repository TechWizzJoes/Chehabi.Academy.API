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

	async GetAll(filter: CoursesModels.Filter): Promise<Course[]> {
		// return this.courseRepository.find({
		// 	where: {
		// 		IsDeleted: false,
		// 		IsActive: true
		// 	},
		// 	relations: ['Instructor.User']
		// });

		const query = this.courseRepository
			.createQueryBuilder('course')
			.leftJoinAndSelect('course.Instructor', 'instructor')
			.leftJoinAndSelect('instructor.User', 'user')
			.where('course.IsDeleted = :isDeleted', { isDeleted: false })
			.andWhere('course.IsActive = :isActive', { isActive: true });

		if (filter.Rating) {
			query.andWhere('course.Rating >= :rating', { rating: filter.Rating });
		}

		if (filter.SearchInput) {
			query.andWhere('(course.Name LIKE :search OR course.Description LIKE :search)', {
				search: `%${filter.SearchInput.trim()}%`
			});
		}

		if (filter.Type) {
			query.andWhere('course.Type = :type', { type: filter.Type });
		}

		if (filter.Level) {
			// const { Beginner, Intermediate, Advanced } = filter.Level;
			// const levels = [];
			// if (Beginner) levels.push('Beginner');
			// if (Intermediate) levels.push('Intermediate');
			// if (Advanced) levels.push('Advanced');
			// if (levels.length > 0) {
			// 	query.andWhere('course.Level IN (:...levels)', { levels });
			// }
		}

		// console.log(query.getSql());
		return query.getMany();
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

		delete updateCourse.Classes; // to avoid overriding classes in edit course page

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
