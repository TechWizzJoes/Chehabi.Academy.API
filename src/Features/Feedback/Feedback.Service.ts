import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { FeedbackRepository } from './Feedback.Repository';
import { FeedbackModels } from './Feedback.Models';
import { CoursesService } from '../Courses/Courses.Service';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';

@Injectable()
export class FeedbackService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private FeedbackRepository: FeedbackRepository,
		private UserHelper: UserHelper,
		private readonly courseService: CoursesService
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackRepository.GetById(id);
	}

	async Getall(): Promise<FeedbackModels.MasterModel[]> {
		return this.FeedbackRepository.Getall();
	}

	async getByUser(): Promise<FeedbackModels.MasterModel[]> {
		const userId = this.UserHelper.GetCurrentUser().UserId;
		const feedbacks = await this.FeedbackRepository.getByUserId(userId);

		return feedbacks;
	}

	async Create(reqModel: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		const userId = this.UserHelper.GetCurrentUser().UserId;

		const course = await this.courseService.GetById(reqModel.CourseId);
		if (!course) {
			throw new ApplicationException(ErrorCodesEnum.COURSE_NOT_FOUND, HttpStatus.BAD_REQUEST);
		}

		reqModel.CreatedBy = userId;
		console.log(reqModel);
		const newFeedback = await this.FeedbackRepository.Create(reqModel);

		const feedbacks = await this.FeedbackRepository.getByCourseId(reqModel.CourseId);
		await this.updateCourseRating(reqModel.CourseId, feedbacks);

		return newFeedback;
	}

	async Update(id, course: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		return await this.FeedbackRepository.Update(id, course);
	}

	async Delete(id): Promise<FeedbackModels.MasterModel> {
		return await this.FeedbackRepository.Delete(id);
	}

	private async updateCourseRating(courseId: number, feedbacks: FeedbackModels.MasterModel[]): Promise<void> {
		if (feedbacks.length === 0) {
			// rating 0 , raters 0
			await this.courseService.UpdateCourseRating(courseId, 0, 0);
			return;
		}

		const totalRating = feedbacks.reduce((sum, rating) => sum + rating.Rating, 0);
		const averageRating = totalRating / feedbacks.length;

		await this.courseService.UpdateCourseRating(courseId, averageRating, feedbacks.length);
	}
}
