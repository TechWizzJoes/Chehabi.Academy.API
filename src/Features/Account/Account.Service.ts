import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { AccountRepository } from './Account.Repository';
import { AccountModels } from './Account.Models';
import { AccountException } from '@App/Common/Exceptions/Account.Exception';
import axios from 'axios';
import { UserModels } from '../User/User.Models';

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
		const user: UserModels.MasterModel = await this.AccountRepository.GetUserByEmail(email.toLowerCase().trim());
		const loginResult = this.CanSignIn(user, password);
		if (!loginResult.Success) {
			throw new AccountException(loginResult.ErrorMsg);
		}
		const accessToken = this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}

	async GoogleLogin(idToken: string): Promise<AccountModels.LoginResModel> {
		const payload = await this.verifyGoogleToken(idToken);

		if (!payload) {
			throw new AccountException(ErrorCodesEnum.FALSE_GOOGLE_LOGIN);
		}

		const user: UserModels.MasterModel = await this.AccountRepository.GetUserByEmail(payload.email);
		if (!user) {
			return this.Register({
				Email: payload.email,
				FirstName: payload.given_name,
				LastName: payload.family_name,
				ProfilePicturePath: payload.picture,
				Password: payload.email
			} as AccountModels.RegisterReqModel);
		}

		const accessToken = this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}
	async verifyGoogleToken(idToken: string) {
		const googleClientId = this.Config.Auth.Google.ClientID;
		try {
			const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
			const payload = response.data;

			if (payload.aud === googleClientId) {
				// Token is valid, and you can trust the user information in the payload.
				return payload;
			} else {
				// Token is not valid.
				return null;
			}
		} catch (error) {
			// Handle verification error
			console.error('Token verification error:', error);
			return null;
		}
	}
	async Register(registerReqModel: AccountModels.RegisterReqModel): Promise<AccountModels.LoginResModel> {
		let user = await this.AccountRepository.GetUserByEmail(registerReqModel.Email);
		const RegisterResult = this.CanRegister(user);
		if (!RegisterResult.Success) {
			throw new AccountException(RegisterResult.ErrorMsg);
		}
		const encryptedPassword = CryptoHelper.AES.Encrypt(registerReqModel.Password, this.Config.Auth.EncryptionKey);
		registerReqModel.Password = encryptedPassword;
		user = await this.AccountRepository.CreateUser(registerReqModel as UserModels.MasterModel);
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

	CanSignIn(user: UserModels.MasterModel, password: string) {
		if (user == null) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.USER_NOT_FOUND
			};
		}
		const dbpw = CryptoHelper.AES.Decrypt(user.Password, this.Config.Auth.EncryptionKey);

		if (password != dbpw) {
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

	CanRegister(user: UserModels.MasterModel) {
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

	GetAccessToken(user: UserModels.MasterModel): string {
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				UserId: user.Id,
				IsAdmin: user.IsAdmin
			} as AccountModels.JwtModel);
		return accessToken;
	}

	GetRefreshToken(user: UserModels.MasterModel): string {
		const refreshToken = this.JwtService.sign(
			{
				UserId: user.Id,
				IsAdmin: user.IsAdmin
			} as AccountModels.JwtModel,
			{
				expiresIn: this.Config.Auth.Jwt.RefreshTokenSpan
			}
		);
		// we should add this refresh token to the contact in db
		// so every user should have a valid refresh token with him then remove on logout
		return refreshToken;
	}

	GetCurrentUser(user: UserModels.MasterModel): AccountModels.CurrentUser {
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

	async GetProfileInfo(): Promise<AccountModels.CurrentUser> {
		let id = this.UserHelper.GetCurrentUser().UserId;
		const user: UserModels.MasterModel = await this.AccountRepository.GetUserById(id);
		return user;
	}
}
