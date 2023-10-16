import { ApiProperty } from '@nestjs/swagger';

export namespace AccountModels {
	export class User {
		Id: number;
		FirstName: string;
		LastName: string;
		Email: string;
		Password: string;
		AccountIsAdmin: boolean;
		ProfilePicturePath: string;
	}

	export class CurrentUser {
		Id!: number;
		FirstName!: string;
		LastName!: string;
		Email!: string;
		IsAdmin!: boolean;
		ProfilePicturePath: string;
	}

	export class JwtModel {
		UserId!: number;
		IsAdmin!: boolean;
	}

	export class LoginReqModel {
		@ApiProperty()
		Email!: string;
		@ApiProperty()
		Password!: string;
	}

	export class RegisterReqModel {
		@ApiProperty()
		Email!: string;
		@ApiProperty()
		Password!: string;
	}

	export class LoginResModel {
		constructor(public AccessToken: string, public RefreshToken: string, public CurrentUser: CurrentUser) { }
	}

	export class RegisterResModel {
		constructor(public AccessToken: string, public RefreshToken: string, public CurrentUser: CurrentUser) { }
	}

	export class CurrentUserResModel {
		Id!: number;
		FirstName!: string;
		LastName!: string;
		Email!: string;
		Extension!: string;
		ExtensionPassword!: string;
		IsAdmin!: boolean;
		AccountHost!: string;
		ProfilePicturePath!: string;
	}

	export class RefreshTokenResModel {
		constructor(public AccessToken: string, public RefreshToken: string) { }
	}

}
