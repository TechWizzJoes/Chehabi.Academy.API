import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { AccountRepository } from './Account.Repository';
import { AccountModels } from './Account.Models';
import { AccountException } from '@App/Common/Exceptions/Account.Exception';

@Injectable()
export class AccountService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private AccountRepository: AccountRepository,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async Login(email: string, password: string): Promise<AccountModels.LoginResModel> {
		const user: AccountModels.User = await this.AccountRepository.GetUserByEmail(email);
		const loginResult = this.CanSignIn(user, password);
		if (!loginResult.Success) {
			throw new AccountException(loginResult.ErrorMsg);
		}
		const accessToken = this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}

	async Register(registerReqModel: AccountModels.RegisterReqModel): Promise<AccountModels.LoginResModel> {
		let user = await this.AccountRepository.GetUserByEmail(registerReqModel.Email);
		const RegisterResult = this.CanRegister(user);
		if (!RegisterResult.Success) {
			throw new AccountException(RegisterResult.ErrorMsg);
		}
		const encryptedPassword = CryptoHelper.TripleDES.Encrypt(user.Password, this.Config.Auth.EncryptionKey)
		user.Password = encryptedPassword;
		user = await this.AccountRepository.CreateUser(registerReqModel as AccountModels.User);
		const accessToken = this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}

	async RefreshAccessToken(id: number): Promise<AccountModels.RefreshTokenResModel> {
		const user = await this.AccountRepository.GetUserById(id);
		if (!user) {
			throw new AccountException(ErrorCodesEnum.USER_NOT_FOUND);
		}
		const accessToken = this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		return new AccountModels.RefreshTokenResModel(accessToken, refreshToken);
	}

	CanSignIn(user: AccountModels.User, password: string) {
		const passwordEncrypted = CryptoHelper.TripleDES.Encrypt(password, this.Config.Auth.EncryptionKey);

		if (user == null) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.USER_NOT_FOUND
			};
		}

		if (user.Password != passwordEncrypted) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.WRONG_PASSWORD
			};
		}

		return {
			Success: true,
			ErrorMsg: null
		};
	}

	CanRegister(user: AccountModels.User) {
		if (user == null) {
			return {
				Success: true,
				ErrorMsg: null
			};
		} else {
			return {
				Success: true,
				ErrorMsg: ErrorCodesEnum.USER_ALREADY_EXISTS
			};
		}
	}

	GetAccessToken(user: AccountModels.User): string {
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				UserId: user.Id,
				IsAdmin: user.IsAdmin,
			} as AccountModels.JwtModel);
		return accessToken;
	}

	GetRefreshToken(user: AccountModels.User): string {
		const refreshToken = this.JwtService.sign(
			{
				UserId: user.Id,
				IsAdmin: user.IsAdmin,
			} as AccountModels.JwtModel,
			{
				expiresIn: this.Config.Auth.Jwt.RefreshTokenSpan
			}
		);
		// we should add this refresh token to the contact in db
		// so every user should have a valid refresh token with him then remove on logout
		return refreshToken;
	}

	GetCurrentUser(user: AccountModels.User): AccountModels.CurrentUser {
		const currentUser = {
			Id: user.Id,
			FirstName: user.FirstName,
			LastName: user.LastName,
			Email: user.Email,
			IsAdmin: user.IsAdmin,
			ProfilePicturePath: user.ProfilePicturePath
		} as AccountModels.CurrentUser;
		return currentUser;
	}
}
