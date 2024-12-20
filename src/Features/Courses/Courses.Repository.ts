import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { CoursesModels } from './Courses.Models';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { User } from '@App/Data/TypeOrmEntities/User';
import { UserClass } from '@App/Data/TypeOrmEntities/UserClass';

@Injectable()
export class CoursesRepository {
	constructor(
		@InjectRepository(Course)
		private courseRepository: Repository<Course>,
		@InjectRepository(UserClass)
		private userClassRepository: Repository<UserClass>
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
			query.andWhere(
				'(course.Name LIKE :search OR course.Description LIKE :search OR course.ToBeLearned LIKE :search)',
				{
					search: `%${filter.SearchInput.trim()}%`
				}
			);
		}

		if (filter.Type) {
			query.andWhere('course.Type = :type', { type: filter.Type });
		}

		if (filter.Level) {
			query.andWhere('course.Level = :level', { level: filter.Level });
		}

		// console.log(query.getSql());
		return query.getMany();
	}

	async GetById(id: number): Promise<CoursesModels.MasterModel> {
		let dbCourse = await this.courseRepository.findOne({
			where: {
				Id: id,
				IsDeleted: false
			},
			relations: ['Instructor.User', 'Classes.LiveSessions', 'Classes.UserClasses.User']
		});

		// return CourseMapper.toDomainModel(dbCourse);
		return dbCourse;
	}

	async GetByIdPublic(id: number): Promise<CoursesModels.MasterModel> {
		const dbCourse = await this.courseRepository
			.createQueryBuilder('course')
			.leftJoinAndSelect('course.Instructor', 'instructor')
			.leftJoinAndSelect('instructor.User', 'user')
			.leftJoinAndSelect('course.Classes', 'classes', 'classes.IsDeleted = false AND classes.IsActive = true')
			.leftJoinAndSelect('classes.LiveSessions', 'liveSessions')
			.leftJoinAndSelect('classes.UserClasses', 'userClasses')
			.leftJoinAndSelect('userClasses.User', 'userInClass')
			.where('course.Id = :id', { id })
			.andWhere('course.IsDeleted = false')
			.andWhere('course.IsActive = true')
			.getOne();

		return dbCourse;
	}

	async GetEnrolledCoursesByUserId(userId: number): Promise<UserClass[]> {
		const userClasses = await this.userClassRepository.find({
			where: {
				UserId: userId,
				Class: {
					IsDeleted: false
				}
			},
			relations: ['Class.Course']
		});

		return userClasses;
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

	async GetAdminCoursesByUserId(InstructorId: number): Promise<Course[]> {
		const Classes = await this.courseRepository.find({
			where: {
				InstructorId: InstructorId,
				IsDeleted: false
			},
			relations: ['Instructor.User', 'Level', 'Type']
		});

		return Classes;
	}
	async UpdateCourseRating(id: number, Rating: number, Raters: number): Promise<Course> {
		let updateCourse: Course = await this.courseRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateCourse) {
			// handle case where the course is not found
			return null;
		}
		updateCourse.Rating = Rating;
		updateCourse.Raters = Raters;
		return await this.courseRepository.save(updateCourse);
	}
}
