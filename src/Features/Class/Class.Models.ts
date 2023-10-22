import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';

export namespace ClassModels {
	export class MasterModel {
		Id: number;
		StartDate: string;
		EndDate: string;
		MaxCapacity: number | null;
		Period: string | null;
		CurrentIndex: number | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
		Users: User[];
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ReqModel implements Partial<MasterModel> {
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
		@ApiProperty()
		IsActive: boolean | null;
		@ApiProperty()
		IsDeleted: boolean | null;
		@ApiProperty()
		Users: User[];
	}
}
