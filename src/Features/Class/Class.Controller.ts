import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { ClassModels } from './Class.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { ClassService } from './Class.Service';
import { UserModels } from '../User/User.Models';

@ApiTags('Class')
// @UseGuards(AuthenticatedGuard)
@Controller('Class')
export class ClassController {
	constructor(private ClassService: ClassService) {}

	// @UseGuards(AuthenticatedGuard) // must be admin only also must be the exact user of created by
	@Get('/:id')
	GetOne(@Param('id', ParseIntPipe) id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.GetById(id);
	}

	@UseGuards(AuthenticatedGuard)
	@Get('/user/classes')
	async GetEnrolledClassesByUserId(): Promise<UserModels.UserClass[]> {
		let courses = await this.ClassService.GetEnrolledClassesByUserId();
		return courses;
	}

	@Post('')
	@ApiBody({ type: ClassModels.ClassReqModel })
	Create(@Body() course: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Create(course);
	}

	@Put('/:id')
	@ApiBody({ type: ClassModels.ClassReqModel })
	Update(@Param('id') id: number, @Body() course: ClassModels.ClassReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.Delete(id);
	}

	// @UseGuards(AuthenticatedGuard)
	// @Post('join/:classId')
	// @ApiBody({ type: ClassModels.ClassReqModel })
	// JoinClass(@Param('classId') classId: number): Promise<ClassModels.MasterModel> {
	// 	return this.ClassService.JoinClass(classId);
	// }

	@UseGuards(AuthenticatedGuard)
	@Post('join-free-trial/:classId')
	@ApiBody({ type: ClassModels.ClassReqModel })
	JoinFreeTrial(@Param('classId') classId: number): Promise<any> {
		return this.ClassService.JoinFreeTrial(classId);
	}
}
