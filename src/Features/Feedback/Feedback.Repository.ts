import { Injectable } from '@nestjs/common';
import { Config } from '@App/Config/App.Config';
import { And, IsNull, Not, Raw, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from '@App/Data/TypeOrmEntities/Feedback';
import { FeedbackModels } from './Feedback.Models';

@Injectable()
export class FeedbackRepository {
	Config: Config;

	constructor(
		@InjectRepository(Feedback)
		private Feedback: Repository<Feedback>
	) {}

	async Getall(): Promise<Feedback[]> {
		return this.Feedback.find({
			where: {
				Text: And(
					Not(IsNull()),
					Raw((alias) => `TRIM(${alias}) != ''`)
				)
			},
			order: {
				Rating: 'desc'
			},
			relations: ['User']
		});
	}

	async GetById(id: number): Promise<Feedback> {
		return this.Feedback.findOne({
			where: {
				Id: id
			},
			relations: ['User']
		});
	}

	async getByUserId(userId: number): Promise<Feedback[]> {
		return await this.Feedback.find({ where: { CreatedBy: userId } });
	}

	async getByCourseId(courseId: number): Promise<Feedback[]> {
		return await this.Feedback.find({ where: { CourseId: courseId } });
	}

	async Create(feedback: FeedbackModels.ReqModel): Promise<Feedback> {
		const newFeedback = await this.Feedback.upsert(
			{
				...feedback,
				IsDeleted: false
			},
			['CreatedBy', 'CourseId']
		);
		return newFeedback.generatedMaps[0] as Feedback;
	}

	async Update(id, Feedback: FeedbackModels.ReqModel): Promise<Feedback> {
		let updateFeedback: Feedback = await this.Feedback.findOne({
			where: {
				Id: id
			}
		});

		updateFeedback.Text = Feedback.Text;
		updateFeedback.Rating = Feedback.Rating;
		return await this.Feedback.save(updateFeedback);
	}

	async Delete(id): Promise<Feedback> {
		let updateFeedback: Feedback = await this.Feedback.findOne({
			where: {
				Id: id
			}
		});

		updateFeedback.IsDeleted = true;

		return await this.Feedback.save(updateFeedback);
	}
}
