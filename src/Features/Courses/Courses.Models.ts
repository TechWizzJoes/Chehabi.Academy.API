import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';

export namespace CoursesModels {
	export class MasterModel {
		Id: number;
		Name: string;
		Description: string | null;
		Instructor: string | null;
		Duration: number | null;
		VideoPath: string | null;
		FilePath: string | null;
		StartDate: Date | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
		Rating: number | null;
		Raters: number | null;
		ImageUrl: string | null;
		Prerequisite: string | null;
		ToBeLearned: string | null;
		Price: number | null;
		Classes: ClassModels.MasterModel[];
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class CoursesReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Name: string;
		@ApiProperty()
		Description: string | null;
		@ApiProperty()
		Instructor: string | null;
		@ApiProperty()
		Duration: number | null;
		@ApiProperty()
		VideoPath: string | null;
		@ApiProperty()
		FilePath: string | null;
		@ApiProperty()
		StartDate: Date | null;
		@ApiProperty()
		ImageUrl: string | null;
		@ApiProperty()
		Prerequisite: string | null;
		@ApiProperty()
		ToBeLearned: string | null;
		@ApiProperty()
		Price: number | null;
	}
}
