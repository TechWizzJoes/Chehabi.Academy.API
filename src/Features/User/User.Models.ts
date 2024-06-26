import { ClassModels } from '../Class/Class.Models';

export namespace UserModels {
	export class MasterModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate?: string;
		IsActive?: boolean;
		IsDeleted?: boolean;
		Email: string;
		Password: string;
		IsAdmin: boolean;
		ProfilePicturePath: string;
		Classes: ClassModels.MasterModel[];
	}

	export class UserResModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate?: string;
		Email: string;
		ProfilePicturePath: string;
	}

	export class UserReqModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate?: string;
		Email: string;
		ProfilePicturePath: string;
	}
}
