import { ApiProperty } from '@nestjs/swagger';

export namespace UserModels {
	export class User {
		Id: number;
		FirstName: string;
		LastName: string;
		Email: string;
		Password: string;
		Extension: string;
		AccountId: number;
		AccountHost: string;
		AccountDbUsername: string;
		AccountDbPassword: string;
		MaxContacts: number;
		MaxContactImport: number;
		MaxCustomFields: number;
		MaxSessionContacts: number;
		DialerIsAdmin: boolean;
		ProfilePicturePath: string;
	}

	export class JwtModel {
		UserId!: number;
		IsAdmin!: boolean;
		AccountId!: number;
		AccountHost!: string;
		Extension!: string;
		MaxContacts!: number;
		MaxContactImport!: number;
		MaxCustomFields!: number;
		MaxFolderLevel!: number;
		MaxSessionContacts!: number;
		LogToken!: string;
	}

	export class LoginReqModel {
		@ApiProperty()
		Email!: string;
		@ApiProperty()
		Password!: string;
	}

	export class LoginResModel {
		AccessToken!: string;
		CurrentUser!: CurrentUserResModel;
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

	export class SMSUserModel {
		Id!: number;
		Did!: string;
		Ext!: string;
		Name!: string;
		ManageSMSNumbers!: string;
	}

	export class ExtensionPasswordResModel {
		ExtensionPassword!: string;
	}
}
