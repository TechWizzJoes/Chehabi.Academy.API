import { Injectable } from '@nestjs/common';
import { AppConfig, Config } from '@App/Config/App.Config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from '@App/Data/TypeOrmEntities/Feedback';
import { FeedbackModels } from './Feedback.Models';

@Injectable()
export class FeedbackRepository {
	Config: Config;

	constructor(@InjectRepository(Feedback) private Feedback: Repository<Feedback>) {}

	async Getall(): Promise<Feedback[]> {
		return this.Feedback.find();
	}

	async GetById(id: number): Promise<Feedback> {
		return this.Feedback.findOne({
			where: {
				Id: id
			}
		});
	}

	async Create(Feedback: FeedbackModels.ReqModel): Promise<Feedback> {
		const newFeedback = this.Feedback.create({
			Text: Feedback.Text,
			UserId: Feedback.UserId,
			IsDeleted: false
		});
		return await this.Feedback.save(newFeedback);
	}

	async Update(id, Feedback: FeedbackModels.ReqModel): Promise<Feedback> {
		let updateFeedback: Feedback = await this.Feedback.findOne({
			where: {
				Id: id
			}
		});

		updateFeedback.Text = Feedback.Text;
		updateFeedback.UserId = Feedback.UserId;
		updateFeedback.IsDeleted = Feedback.IsDeleted;
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
