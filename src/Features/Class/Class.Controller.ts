import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { ClassModels } from './Class.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { ClassService } from './Class.Service';
import { UserModels } from '../User/User.Models';
import { AdminGuard } from '@App/Common/Auth/Admin.Guard';

@UseGuards(AuthenticatedGuard)
@ApiTags('Class')
@Controller('Class')
export class ClassController {
	constructor(private ClassService: ClassService) {}

	@Get('/:id')
	@UseGuards(AdminGuard)
	GetOne(@Param('id', ParseIntPipe) id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.GetById(id);
	}

	@Get('/user/classes')
	async GetEnrolledClassesByUserId(): Promise<UserModels.UserClass[]> {
		let courses = await this.ClassService.GetEnrolledClassesByUserId();
		return courses;
	}

	@Post('')
	@UseGuards(AdminGuard)
	@ApiBody({ type: ClassModels.ClassReqModel })
	Create(@Body() course: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Create(course);
	}

	@Put('/:id')
	@UseGuards(AdminGuard)
	@ApiBody({ type: ClassModels.ClassReqModel })
	Update(@Param('id') id: number, @Body() course: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Update(id, course);
	}

	@Delete('/:id')
	@UseGuards(AdminGuard)
	Delete(@Param('id') id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.Delete(id);
	}

	@Post('join-free-trial/:classId')
	@ApiBody({ type: ClassModels.ClassReqModel })
	JoinFreeTrial(@Param('classId') classId: number): Promise<any> {
		return this.ClassService.JoinFreeTrial(classId);
	}
}
