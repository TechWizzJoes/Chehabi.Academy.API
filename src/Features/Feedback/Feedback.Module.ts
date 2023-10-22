import { Module } from '@nestjs/common';
import { DataModule } from '@App/Data/Data.Module';
import { CommonModule } from '@App/Common/Common.Module';
import { AppConfig } from '@App/Config/App.Config';
import { FeedbackRepository } from './Feedback.Repository';
import { FeedbackController } from './Feedback.Controller';
import { FeedbackService } from './Feedback.Service';

@Module({
	imports: [DataModule, CommonModule],
	controllers: [FeedbackController],
	providers: [AppConfig, FeedbackService, FeedbackRepository]
})
export class FeedbackModule {}
