import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { FeedbackModels } from './Feedback.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { FeedbackService } from './Feedback.Service';

@ApiTags('Feedback')
@Controller('Feedback')
export class FeedbackController {
	constructor(private FeedbackService: FeedbackService) {}

	@Get('/:id')
	GetOne(@Param('id') id: number): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackService.GetById(id);
	}

	@Get('list/all')
	GetAll(): Promise<FeedbackModels.MasterModel[]> {
		return this.FeedbackService.Getall();
	}

	@Get('user/:userId')
	@UseGuards(AuthenticatedGuard)
	@ApiResponse({ status: 200, description: 'Rating for the user and course', type: FeedbackModels.MasterModel })
	async getRByUser(): Promise<FeedbackModels.MasterModel[]> {
		return this.FeedbackService.getByUser();
	}

	@Post('')
	@UseGuards(AuthenticatedGuard)
	@ApiBody({ type: FeedbackModels.ReqModel })
	Create(@Body() course: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackService.Create(course);
	}

	@Put('/:id')
	@ApiBody({ type: FeedbackModels.ReqModel })
	Update(@Param('id') id: number, @Body() course: FeedbackModels.ReqModel): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<FeedbackModels.MasterModel> {
		return this.FeedbackService.Delete(id);
	}
}
