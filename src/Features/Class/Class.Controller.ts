import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { ClassModels } from './Class.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { ClassService } from './Class.Service';

@ApiTags('Class')
@UseGuards(AuthenticatedGuard)
@Controller('Class')
export class ClassController {
	constructor(private ClassService: ClassService) {}

	@Get('/:id')
	GetOne(@Param('id') id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.GetById(id);
	}

	@Get('list/all')
	GetAll(): Promise<ClassModels.MasterModel[]> {
		return this.ClassService.Getall();
	}

	@Post('')
	@ApiBody({ type: ClassModels.ReqModel })
	Create(@Body() course: ClassModels.ReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Create(course);
	}

	@Put('/:id')
	@ApiBody({ type: ClassModels.ReqModel })
	Update(@Param('id') id: number, @Body() course: ClassModels.ReqModel): Promise<ClassModels.MasterModel> {
		return this.ClassService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<ClassModels.MasterModel> {
		return this.ClassService.Delete(id);
	}
}
