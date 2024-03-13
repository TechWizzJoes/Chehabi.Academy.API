import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {} from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { UserModels } from './User.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';
import { UserService } from './User.Service';

@ApiTags('User')
// @UseGuards(AuthenticatedGuard)
@Controller('User')
export class UserController {
	constructor(private UserService: UserService) {}

	@Get('/:id')
	@UseGuards(AuthenticatedGuard)
	GetProfileInfo(@Param('id') id: number): Promise<UserModels.UserResModel> {
		return this.UserService.GetById(id);
	}

	@Put('')
	@ApiBody({ type: UserModels.UserReqModel })
	Update(@Body() user: UserModels.UserReqModel): Promise<UserModels.UserResModel> {
		return this.UserService.SaveUser(user);
	}
}
