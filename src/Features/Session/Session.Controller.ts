import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { LiveSessionModels } from './Session.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { SessionService } from './Session.Service';

@ApiTags('Session')
// @UseGuards(AuthenticatedGuard)
@Controller('session')
export class SessionController {
	constructor(private SessionService: SessionService) {}

	@Get('/:id')
	GetallByClassId(@Param('id') classId: number): Promise<LiveSessionModels.MasterModel[]> {
		return this.SessionService.GetallByClassId(classId);
	}

	@Post('')
	@ApiBody({ type: LiveSessionModels.SessionReqModel })
	Create(@Body() Session: LiveSessionModels.SessionReqModel): Promise<LiveSessionModels.MasterModel> {
		return this.SessionService.Create(Session);
	}

	@Put('/:id')
	@ApiBody({ type: LiveSessionModels.SessionReqModel })
	Update(
		@Param('id') id: number,
		@Body() Session: LiveSessionModels.SessionReqModel
	): Promise<LiveSessionModels.MasterModel> {
		return this.SessionService.Update(id, Session);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<void> {
		return this.SessionService.Delete(id);
	}

	@Get('/list/upcoming')
	GetUpcomingByUserId(): Promise<LiveSessionModels.MasterModel[]> {
		return this.SessionService.GetUpcomingByUserId();
	}
}
