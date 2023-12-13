import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { UserModels } from '../User/User.Models';

export namespace FeedbackModels {
	export class MasterModel {
		Id: number;
		Text: string | null;
		UserId: number | null;
		IsDeleted: boolean | null;
		CreatedDate: Date | null;
		User: UserModels.MasterModel;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Text: string | null;
		@ApiProperty()
		UserId: number | null;
		@ApiProperty()
		IsDeleted: boolean | null;
	}
}
