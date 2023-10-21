import { ApiProperty } from '@nestjs/swagger';

export namespace CoursesModels {
	export class MasterModel {
		Id: number;
		Name: string;
		Description: string | null;
		VideoPath: string | null;
		FilePath: string | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Name: string;
		@ApiProperty()
		Description: string | null;
		@ApiProperty()
		VideoPath: string | null;
		@ApiProperty()
		FilePath: string | null;
		@ApiProperty()
		IsActive: boolean | null;
		@ApiProperty()
		IsDeleted: boolean | null;
	}
}
