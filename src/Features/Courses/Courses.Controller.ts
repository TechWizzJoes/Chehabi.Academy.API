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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CoursesModels } from './Courses.Models';
import { CoursesService } from './Courses.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

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

	@Get('/list/all')
	async GetAll(): Promise<CoursesModels.MasterModel[]> {
		let courses = await this.CoursesService.Getall();
		return courses;
	}

	@Post('')
	@ApiBody({ type: CoursesModels.CoursesReqModel })
	Create(@Body() course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		// return this.CoursesService.Create(course);
		let x = this.CoursesService.Create(course);
		return x;
	}

	@Post('/upload/image/:id')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: `./uploads/images/courses`,
				filename: (req, file, callback) => {
					const uniquName = req.params.id;
					const ext = extname(file.originalname);
					const fileName = uniquName + ext;
					callback(null, fileName);
				}
			})
		})
	)
	UploadImage(@UploadedFile() file: Express.Multer.File): Promise<{}> {
		return this.CoursesService.Upload(file.path);
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

	@Get('uploads/images/courses/:image')
	GetCourseImage(@Param('image') imageName: any, @Res() res: any) {
		return res.sendFile(join(process.cwd(), 'uploads/images/courses/' + imageName));
	}

	@Post('/upload/file/:id')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: `./uploads/files/courses`,
				filename: (req, file, callback) => {
					const uniquName = req.params.id;
					const ext = extname(file.originalname);
					const fileName = uniquName + ext;
					callback(null, fileName);
				}
			})
		})
	)
	UploadFile(@UploadedFile() file: Express.Multer.File): Promise<{}> {
		return this.CoursesService.Upload(file.path);
	}
}
