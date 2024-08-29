import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
	Delete,
	Put,
	ParseIntPipe,
	UseInterceptors,
	UploadedFile,
	Res
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RatingModels } from './Rating.Models';
import { RatingService } from './Rating.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ClassModels } from '../Class/Class.Models';

@ApiTags('Ratings')
@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@Post('')
	@ApiResponse({ status: 201, description: 'Rating added successfully', type: RatingModels.RatingResModel })
	async addRating(@Body() ratingData: RatingModels.RatingReqModel): Promise<RatingModels.RatingResModel> {
		return this.ratingService.addRating(ratingData);
	}

	@Get('course/:courseId/user')
	@ApiResponse({ status: 200, description: 'Rating for the user and course', type: RatingModels.RatingResModel })
	async getRatingByUserAndCourse(
		@Param('courseId', ParseIntPipe) courseId: number,
		@Body('userId', ParseIntPipe) userId: number
	): Promise<RatingModels.RatingResModel> {
		return this.ratingService.getRatingByUserAndCourse(userId, courseId);
	}

	@Get('user/:userId')
	@ApiResponse({ status: 200, description: 'Rating for the user and course', type: RatingModels.RatingResModel })
	async getRByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<RatingModels.RatingResModel[]> {
		return this.ratingService.getRatingByUserId(userId);
	}
}
