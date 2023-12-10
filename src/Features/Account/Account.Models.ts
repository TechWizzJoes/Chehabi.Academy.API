import { ApiProperty } from '@nestjs/swagger';

export namespace AccountModels {
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

	export class GoogleLoginReqModel {
		@ApiProperty()
		IdToken: string;
	}

	export class RegisterReqModel {
		@ApiProperty()
		Email!: string;
		@ApiProperty()
		Password!: string;
		@ApiProperty()
		FirstName: string;
		@ApiProperty()
		LastName: string;
		@ApiProperty()
		Birthdate?: string;
		ProfilePicturePath?: string;
	}

	export class RefreshTokenReqModel {
		@ApiProperty()
		Id!: number;
		@ApiProperty()
		RefreshToken!: string;
		@ApiProperty()
		AccessToken!: string;
	}

	export class LoginResModel {
		constructor(public AccessToken: string, public RefreshToken: string, public CurrentUser: CurrentUser) {}
	}

	export class RegisterResModel {
		constructor(public AccessToken: string, public RefreshToken: string, public CurrentUser: CurrentUser) {}
	}

	export class RefreshTokenResModel {
		constructor(public AccessToken: string, public RefreshToken: string) {}
	}
}
