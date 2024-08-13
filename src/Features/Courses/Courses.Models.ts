import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';
import { UserModels } from '../User/User.Models';

export namespace CoursesModels {
	export class MasterModel {
		Id: number;
		Name: string;
		Description: string | null;
		InstructorId: number | null;
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
		Instructor: UserModels.MasterModel;
		IsLive: boolean;
		CreatedOn: Date;
		UpdatedOn: Date;
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
		InstructorId: number | null;
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
