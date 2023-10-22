import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { CoursesModels } from './Courses.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { CoursesService } from './Courses.Service';

@ApiTags('Courses')
@UseGuards(AuthenticatedGuard)
@Controller('Courses')
export class CoursesController {
	constructor(private CoursesService: CoursesService) {}

	@Get('/:id')
	GetOne(@Param('id') id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.GetById(id);
	}

	@Get('list/all')
	GetAll(): Promise<CoursesModels.MasterModel[]> {
		return this.CoursesService.Getall();
	}

	@Post('')
	@ApiBody({ type: CoursesModels.ReqModel })
	Create(@Body() course: CoursesModels.ReqModel): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Create(course);
	}

	@Put('/:id')
	@ApiBody({ type: CoursesModels.ReqModel })
	Update(@Param('id') id: number, @Body() course: CoursesModels.ReqModel): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Delete(id);
	}
}
