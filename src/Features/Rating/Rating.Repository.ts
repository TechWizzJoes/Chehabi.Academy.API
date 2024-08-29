import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { RatingModels } from './Rating.Models';
import { Class } from '@App/Data/TypeOrmEntities/Class';
import { User } from '@App/Data/TypeOrmEntities/User';
import { CoursesService } from '../Courses/Courses.Service';
import { Rating } from '@App/Data/TypeOrmEntities/Rating';

@Injectable()
export class RatingRepository {
	constructor(
		@InjectRepository(Rating)
		private readonly ratingRepository: Repository<Rating>
	) {}

	async createRating(ratingData: RatingModels.RatingReqModel): Promise<Rating> {
		const newRating = this.ratingRepository.create(ratingData);
		return await this.ratingRepository.save(newRating);
	}

	async getRatingsByUserId(userId: number): Promise<Rating[]> {
		return await this.ratingRepository.find({ where: { UserId: userId } });
	}

	async getRatingsByCourseId(courseId: number): Promise<Rating[]> {
		return await this.ratingRepository.find({ where: { CourseId: courseId } });
	}
	async findOneByUserAndCourse(userId: number, courseId: number): Promise<Rating> {
		return this.ratingRepository.findOne({
			where: {
				UserId: userId,
				CourseId: courseId
			},
			relations: ['Course', 'User']
		});
	}
}
