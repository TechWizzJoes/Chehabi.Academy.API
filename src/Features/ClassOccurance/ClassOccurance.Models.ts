import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';

export namespace ClassOccuranceModels {
	export class MasterModel {
		Id: number;
		ClassId: number;
		Occurance: string;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ClassOccuranceReqModel implements Partial<MasterModel> {
		@ApiProperty()
		ClassId: number;
		@ApiProperty()
		Occurance: string;
	}
}
