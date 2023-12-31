import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CoursesModels } from './Courses.Models';
import { CoursesService } from './Courses.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';

@ApiTags('Courses')
// @UseGuards(AuthenticatedGuard)
@Controller('courses')
export class CoursesController {
	constructor(private CoursesService: CoursesService) {}

	@Get('/:id')
	GetOne(@Param('id', ParseIntPipe) id: number): Promise<CoursesModels.MasterModel> {
		let courses = this.CoursesService.GetById(id);
		return courses;
	}

	@Get('list/all')
	async GetAll(): Promise<CoursesModels.MasterModel[]> {
		let courses = await this.CoursesService.Getall();
		return courses;
	}

	@Post('')
	@ApiBody({ type: CoursesModels.CoursesReqModel })
	Create(@Body() course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		// return this.CoursesService.Create(course);
		let x = this.CoursesService.Create(course);
		return;
	}

	@Put('/:id')
	@ApiBody({ type: CoursesModels.CoursesReqModel })
	Update(@Param('id') id: number, @Body() course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Delete(id);
	}
}
