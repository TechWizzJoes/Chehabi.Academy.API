import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AccountService } from '@App/Features/Account/Account.Service';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { AccountModels } from './Account.Models';
import { RefreshTokenGuard } from '@App/Common/Auth/RefreshToken.Guard';

@ApiTags('Account')
@Controller('account')
export class AccountController {
	constructor(private AccountService: AccountService) { }

	@Post('login')
	@ApiBody({ type: AccountModels.LoginReqModel })
	Login(@Body() LoginReqModel: AccountModels.LoginReqModel): Promise<AccountModels.LoginResModel> {
		return this.AccountService.Login(LoginReqModel.Email, LoginReqModel.Password);
	}

	@Post('register')
	@ApiBody({ type: AccountModels.RegisterReqModel })
	Register(@Body() RegisterReqModel: AccountModels.RegisterReqModel): Promise<AccountModels.RegisterResModel> {
		return this.AccountService.Register(RegisterReqModel.Email, RegisterReqModel.Password);
	}

	@Post('refresh')
	@UseGuards(RefreshTokenGuard)
	@ApiBody({ type: AccountModels.RefreshTokenReqModel })
	RefreshToken(
		@Body() RefreshTokenReqModel: AccountModels.RefreshTokenReqModel
	): Promise<AccountModels.RefreshTokenResModel> {
		return this.AccountService.RefreshAccessToken(RefreshTokenReqModel.Id);
	}
}
