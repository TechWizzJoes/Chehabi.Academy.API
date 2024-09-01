import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { promises } from 'dns';
import { ClassModels } from '../Class/Class.Models';
import { CourseTypeEnum } from '@App/Common/Enums/CourseType.Enum';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { Rating } from '@App/Data/TypeOrmEntities/Rating';
import { Course } from '@App/Data/TypeOrmEntities/Course';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesService } from '../Courses/Courses.Service';
import { RatingModels } from './Rating.Models';
import { RatingRepository } from './Rating.Repository';

@Injectable()
export class RatingService {
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly courseService: CoursesService // Assuming you need this for updating course rating
	) {}

	async addRating(ratingData: RatingModels.RatingReqModel): Promise<RatingModels.RatingResModel> {
		const { CourseId, UserId, Rating: rating } = ratingData;
		let newRating;
		// Check if course exists
		const course = await this.courseService.GetById(CourseId);
		if (!course) {
			throw new ApplicationException(ErrorCodesEnum.COURSE_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		const oldRating = await this.ratingRepository.findOneByUserAndCourse(UserId, CourseId);

		if (!oldRating) {
			// Create new rating
			newRating = await this.ratingRepository.createRating({
				CourseId,
				UserId,
				Rating: rating,
				CreatedOn: new Date()
			});
		} else {
			newRating = await this.ratingRepository.updateRating({
				CourseId,
				UserId,
				Rating: rating,
				CreatedOn: new Date()
			});
		}

		// Update course rating
		const ratings = await this.ratingRepository.getRatingsByCourseId(CourseId);
		await this.updateCourseRating(CourseId, ratings);

		return {
			...newRating,
			CreatedOn: newRating.CreatedOn
		};
	}

	private async updateCourseRating(courseId: number, ratings: Rating[]): Promise<void> {
		if (ratings.length === 0) {
			// rating 0 , raters 0
			await this.courseService.UpdateCourseRating(courseId, 0, 0);
			return;
		}

		const totalRating = ratings.reduce((sum, rating) => sum + rating.Rating, 0);
		const averageRating = totalRating / ratings.length;

		await this.courseService.UpdateCourseRating(courseId, averageRating, ratings.length);
	}

	async getRatingByUserAndCourse(userId: number, courseId: number): Promise<RatingModels.RatingResModel> {
		const ratings = await this.ratingRepository.findOneByUserAndCourse(userId, courseId);

		if (!ratings) {
			throw new ApplicationException(ErrorCodesEnum.COURSE_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		return ratings;
	}

	async getRatingByUserId(userId: number): Promise<RatingModels.RatingResModel[]> {
		const ratings = await this.ratingRepository.getRatingsByUserId(userId);

		if (!ratings) {
			throw new ApplicationException(ErrorCodesEnum.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		return ratings;
	}
}
