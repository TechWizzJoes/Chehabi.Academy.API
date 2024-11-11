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
	Res,
	Query,
	HttpStatus,
	ParseBoolPipe
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CoursesModels } from './Courses.Models';
import { CoursesService } from './Courses.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { basename, extname, join } from 'path';
import { ClassModels } from '../Class/Class.Models';
import { AdminGuard } from '@App/Common/Auth/Admin.Guard';
import * as fs from 'fs';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
	constructor(private CoursesService: CoursesService) {}

	@UseGuards(AuthenticatedGuard)
	@UseGuards(AdminGuard)
	@Get('/:id')
	GetOne(@Param('id', ParseIntPipe) id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.GetById(id);
	}

	@Get('/public/:id')
	GetOnePublic(@Param('id', ParseIntPipe) id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.GetByIdPublic(id);
	}

	@UseGuards(AuthenticatedGuard)
	@UseGuards(AdminGuard)
	@Get('/admin/courses')
	async GetAdminCoursesByUserId(): Promise<CoursesModels.MasterModel[]> {
		let courses = await this.CoursesService.GetAdminCoursesByUserId();
		return courses;
	}

	@Post('/list/all')
	async GetAll(@Body() filter: CoursesModels.Filter): Promise<CoursesModels.MasterModel[]> {
		let courses = await this.CoursesService.Getall(filter);
		return courses;
	}

	@Post('')
	@UseGuards(AuthenticatedGuard)
	@UseGuards(AdminGuard)
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
				destination: (req, file, callback) => {
					const id = req.params.id;
					const dir = `${process.env.COURSES_STORAGE_FOLDER}/${id}`;
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir, { recursive: true });
					}
					callback(null, dir);
				},
				filename: (req, file, callback) => {
					const ext = extname(file.originalname);
					const name = basename(file.originalname, ext);
					const isSample = req.query.IsSample === 'true';
					const fileName = name + '.' + new Date().getTime() + (isSample ? '.sample' : '') + ext;
					callback(null, fileName);
				}
			})
		})
	)
	UploadImage(@UploadedFile() file: Express.Multer.File): Promise<{}> {
		return this.CoursesService.Upload(file.path);
	}

	@Put('/:id')
	@UseGuards(AuthenticatedGuard)
	@UseGuards(AdminGuard)
	@ApiBody({ type: CoursesModels.CoursesReqModel })
	Update(@Param('id') id: number, @Body() course: CoursesModels.CoursesReqModel): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Update(id, course);
	}

	@Delete('/:id')
	@UseGuards(AuthenticatedGuard)
	@UseGuards(AdminGuard)
	Delete(@Param('id') id: number): Promise<CoursesModels.MasterModel> {
		return this.CoursesService.Delete(id);
	}

	@Get('uploads/files/courses/:id/:file')
	GetCourseFilePublic(@Param('id') id: number, @Param('file') fileName: string, @Res() res: any) {
		const valid = this.CoursesService.ValidateDownloadPublic(fileName);
		if (valid) {
			res.set({
				'Content-Disposition': `attachment; filename="${fileName}"`,
				'Access-Control-Expose-Headers': 'Content-Disposition' // This line exposes the header to get the filename in web as its not the last section of the url
			});
			return res.sendFile(join(process.cwd(), `${process.env.COURSES_STORAGE_FOLDER}/${id}/${fileName}`));
		} else throw new ApplicationException(ErrorCodesEnum.NON_PAID_MATERIAL_DOWNLOAD, HttpStatus.FORBIDDEN);
	}

	@Get('uploads/files/courses/:id/:file/:isadmin')
	@UseGuards(AuthenticatedGuard)
	async GetCourseFile(
		@Param('id') id: number,
		@Param('file') fileName: string,
		@Param('isadmin', ParseBoolPipe) isAdmin: boolean,
		@Res() res: any
	) {
		await this.CoursesService.ValidateDownload(id, fileName, isAdmin);
		res.set({
			'Content-Disposition': `attachment; filename="${fileName}"`,
			'Access-Control-Expose-Headers': 'Content-Disposition' // This line exposes the header to get the filename in web as its not the last section of the url
		});
		return res.sendFile(join(process.cwd(), `${process.env.COURSES_STORAGE_FOLDER}/${id}/${fileName}`));
	}

	@Post('/upload/file/:id')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: (req, file, callback) => {
					const id = req.params.id;
					const dir = `${process.env.COURSES_STORAGE_FOLDER}/${id}`;
					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir, { recursive: true });
					}
					callback(null, dir);
				},
				filename: (req, file, callback) => {
					const ext = extname(file.originalname);
					const name = basename(file.originalname, ext);
					const isSample = req.query.IsSample === 'true';
					const fileName = name + (isSample ? '.sample' : '') + ext;
					callback(null, fileName);
				}
			})
		})
	)
	UploadFile(@UploadedFile() file: Express.Multer.File, @Query('IsSample') isSample: string): Promise<{}> {
		return this.CoursesService.Upload(file.path);
	}
}
