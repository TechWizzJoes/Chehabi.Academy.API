import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { AccountModels } from '../Account/Account.Models';
import { UserModels } from '../User/User.Models';

export namespace ClassModels {
	export class MasterModel {
		Id: number;
		CourseId: number | null;
		StartDate: string;
		EndDate: string;
		MaxCapacity: number | null;
		Period: string | null;
		CurrentIndex: number | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
		Users: UserModels.MasterModel[];
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ClassReqModel implements Partial<MasterModel> {
		@ApiProperty()
		CourseId: number;
		@ApiProperty()
		StartDate: string;
		@ApiProperty()
		EndDate: string;
		@ApiProperty()
		MaxCapacity: number | null;
		@ApiProperty()
		Period: string | null;
		@ApiProperty()
		CurrentIndex: number | null;
	}
}
