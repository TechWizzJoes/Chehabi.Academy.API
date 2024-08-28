import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { UserModels } from '../User/User.Models';

export namespace LiveSessionModels {
	export class MasterModel {
		Id: number;
		ClassId: number;
		StartDate: Date;
		EndDate: Date;
		Link: string | null;
		Class: ClassModels.MasterModel;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class SessionReqModel implements Partial<MasterModel> {
		@ApiProperty()
		ClassId: number;
		@ApiProperty()
		StartDate: Date;
		@ApiProperty()
		Link: string;

		EndDate: Date;
	}
}

export namespace RecordedSessionModels {
	export class MasterModel {
		Id: number;
		CourseId: number;
		Link: string | null;
		Course: CoursesModels.MasterModel;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class SessionReqModel implements Partial<MasterModel> {
		@ApiProperty()
		CourseId: number;
		@ApiProperty()
		Link: string;
	}
}
