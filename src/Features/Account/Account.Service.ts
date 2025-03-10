import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { AccountRepository } from './Account.Repository';
import { AccountModels } from './Account.Models';
import { AccountException } from '@App/Common/Exceptions/Account.Exception';
import axios from 'axios';
import { UserModels } from '../User/User.Models';
import { InstructorModels } from '../User/Instructor.Models';
import { InstructorRepository } from '../User/Instructor.Repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '@App/Common/Events/Events';
import { Constants } from '@App/Common/Constants';

@Injectable()
export class AccountService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private AccountRepository: AccountRepository,
		private InstructorRepository: InstructorRepository,
		private JwtService: JwtService,
		private eventEmitter: EventEmitter2
	) {
		this.Config = this.appConfig.Config;
	}

	async Login(email: string, password: string): Promise<AccountModels.LoginResModel> {
		const user: UserModels.MasterModel = await this.AccountRepository.GetUserByEmail(email.toLowerCase().trim());
		const loginResult = this.CanSignIn(user, password);
		if (!loginResult.Success) {
			throw new AccountException(loginResult.ErrorMsg);
		}
		const accessToken = await this.GetAccessToken(user);
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
				Password: payload.email,
				IsSocial: true
			} as AccountModels.RegisterReqModel);
		}

		const accessToken = await this.GetAccessToken(user);
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

		registerReqModel.FirstName = Constants.CapitalizeFirstLetter(registerReqModel.FirstName);
		registerReqModel.LastName = Constants.CapitalizeFirstLetter(registerReqModel.LastName);
		user = await this.AccountRepository.CreateUser(registerReqModel as UserModels.MasterModel);
		this.eventEmitter.emit(Events.USER_CREATED, user);
		const accessToken = await this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}

	async RefreshAccessToken(id: number): Promise<AccountModels.RefreshTokenResModel> {
		const user = await this.AccountRepository.GetUserById(id);
		if (!user) {
			throw new AccountException(ErrorCodesEnum.USER_NOT_FOUND);
		}
		const accessToken = await this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);

		return new AccountModels.RefreshTokenResModel(accessToken, refreshToken, currentUser);
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

	async GetAccessToken(user: UserModels.MasterModel, instructor?: InstructorModels.MasterModel): Promise<string> {
		if (user.IsAdmin) {
			instructor = await this.InstructorRepository.GetByUserId(user.Id);
		}
		const accessToken =
			'Bearer ' +
			this.JwtService.sign({
				UserId: user.Id,
				Email: user.Email,
				IsAdmin: user.IsAdmin,
				InstructorId: instructor?.Id
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
			IsSocial: user.IsSocial,
			ProfilePicturePath: user.ProfilePicturePath
		} as AccountModels.CurrentUser;
		return currentUser;
	}

	CanResetPassword(user: UserModels.MasterModel, password: AccountModels.ResetPasswordReqModel) {
		if (user == null) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.USER_NOT_FOUND
			};
		}
		const dbpw = CryptoHelper.AES.Decrypt(user.Password, this.Config.Auth.EncryptionKey);

		if (password.OldPassword != dbpw) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.WRONG_PASSWORD
			};
		}

		if (password.NewPassword != password.ReNewPassword) {
			return {
				Success: false,
				ErrorMsg: ErrorCodesEnum.PASSWORD_NOT_MATCH
			};
		}

		return {
			Success: true,
			ErrorMsg: null
		};
	}

	async ResetPassowrd(password: AccountModels.ResetPasswordReqModel): Promise<AccountModels.LoginResModel> {
		let user: UserModels.MasterModel = await this.AccountRepository.GetUserById(password.Id);
		const resetPasswordResult = this.CanResetPassword(user, password);
		if (!resetPasswordResult.Success) {
			throw new AccountException(resetPasswordResult.ErrorMsg);
		}

		const encryptedPassword = CryptoHelper.AES.Encrypt(password.NewPassword, this.Config.Auth.EncryptionKey);
		user.Password = encryptedPassword;
		user = await this.AccountRepository.SaveUser(user);
		const accessToken = await this.GetAccessToken(user);
		const refreshToken = this.GetRefreshToken(user);
		const currentUser = this.GetCurrentUser(user);
		return new AccountModels.LoginResModel(accessToken, refreshToken, currentUser);
	}
}
