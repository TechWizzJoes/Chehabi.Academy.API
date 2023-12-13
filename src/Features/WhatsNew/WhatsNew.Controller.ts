import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { WhatsNewModels } from './WhatsNew.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { WhatsNewService } from './WhatsNew.Service';

@ApiTags('WhatsNew')
// @UseGuards(AuthenticatedGuard)
@Controller('whatsnew')
export class WhatsNewController {
	constructor(private WhatsNewService: WhatsNewService) {}

	// @Get('/:id')
	// GetOne(@Param('id', ParseIntPipe) id: number): Promise<WhatsNewModels.MasterModel> {
	// 	let whatsNew = this.WhatsNewService.GetById(id);
	// 	return whatsNew;
	// }

	@Get('list/all')
	async GetAll(): Promise<WhatsNewModels.MasterModel[]> {
		let whatsNew = await this.WhatsNewService.Getall();
		return whatsNew;
	}

	@Post('')
	@ApiBody({ type: WhatsNewModels.WhatsNewReqModel })
	Create(@Body() whatsNew: WhatsNewModels.WhatsNewReqModel): Promise<WhatsNewModels.MasterModel> {
		// return this.WhatsNewService.Create(whatsNew);
		let x = this.WhatsNewService.Create(whatsNew);
		return;
	}

	@Put('/:id')
	@ApiBody({ type: WhatsNewModels.WhatsNewReqModel })
	Update(
		@Param('id') id: number,
		@Body() whatsNew: WhatsNewModels.WhatsNewReqModel
	): Promise<WhatsNewModels.MasterModel> {
		return this.WhatsNewService.Update(id, whatsNew);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<WhatsNewModels.MasterModel> {
		return this.WhatsNewService.Delete(id);
	}
}
