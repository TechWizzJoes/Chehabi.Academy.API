import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { ClassOccuranceModels } from './ClassOccurance.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { ClassOccuranceService } from './ClassOccurance.Service';

@ApiTags('ClassOccurance')
// @UseGuards(AuthenticatedGuard)
@Controller('ClassOccurance')
export class ClassOccuranceController {
	constructor(private ClassOccuranceService: ClassOccuranceService) {}

	@Get('/:id')
	GetallByClassId(@Param('id') classId: number): Promise<ClassOccuranceModels.MasterModel[]> {
		return this.ClassOccuranceService.GetallByClassId(classId);
	}

	@Post('')
	@ApiBody({ type: ClassOccuranceModels.ClassOccuranceReqModel })
	Create(
		@Body() classOccurance: ClassOccuranceModels.ClassOccuranceReqModel
	): Promise<ClassOccuranceModels.MasterModel> {
		return this.ClassOccuranceService.Create(classOccurance);
	}

	@Put('/:id')
	@ApiBody({ type: ClassOccuranceModels.ClassOccuranceReqModel })
	Update(
		@Param('id') id: number,
		@Body() classOccurance: ClassOccuranceModels.ClassOccuranceReqModel
	): Promise<ClassOccuranceModels.MasterModel> {
		return this.ClassOccuranceService.Update(id, classOccurance);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<void> {
		return this.ClassOccuranceService.Delete(id);
	}
}
