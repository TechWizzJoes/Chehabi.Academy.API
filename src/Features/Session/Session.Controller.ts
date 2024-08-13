import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { SessionModels } from './Session.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { SessionService } from './Session.Service';

@ApiTags('Session')
// @UseGuards(AuthenticatedGuard)
@Controller('Session')
export class SessionController {
	constructor(private SessionService: SessionService) {}

	@Get('/:id')
	GetallByClassId(@Param('id') classId: number): Promise<SessionModels.MasterModel[]> {
		return this.SessionService.GetallByClassId(classId);
	}

	@Post('')
	@ApiBody({ type: SessionModels.SessionReqModel })
	Create(@Body() Session: SessionModels.SessionReqModel): Promise<SessionModels.MasterModel> {
		return this.SessionService.Create(Session);
	}

	@Put('/:id')
	@ApiBody({ type: SessionModels.SessionReqModel })
	Update(
		@Param('id') id: number,
		@Body() Session: SessionModels.SessionReqModel
	): Promise<SessionModels.MasterModel> {
		return this.SessionService.Update(id, Session);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<void> {
		return this.SessionService.Delete(id);
	}
}
