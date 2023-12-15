import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CoursesModels } from './Courses.Models';
import { CoursesService } from './Courses.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import * as path from 'path';
import { Response } from 'express';
import { AppConfig } from '@App/Config/App.Config';
@ApiTags('Courses')
// @UseGuards(AuthenticatedGuard)
@Controller('courses')
export class CoursesController {
	constructor(private CoursesService: CoursesService, private AppConfig: AppConfig) {}

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

	@Get('material/:id')
	async downloadPdf(@Res() res: Response, @Param('id') id: number): Promise<void> {
		console.log('dirname', path.join(__dirname));
		console.log('this.AppConfig.Config.FilesFolder', this.AppConfig.Config.FilesFolder);

		const pdfFilePath = path.join(this.AppConfig.Config.FilesFolder, 'test.pdf'); // Adjust the path to your PDF file
		console.log('pdfFilePath', pdfFilePath);

		res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
		res.setHeader('Content-Type', 'application/pdf');
		res.download(pdfFilePath);
	}
}
