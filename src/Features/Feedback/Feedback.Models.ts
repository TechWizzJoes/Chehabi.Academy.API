import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { InstructorModels } from '../User/Instructor.Models';

export namespace FeedbackModels {
	export class MasterModel {
		Id: number;
		Text: string | null;
		IsDeleted: boolean | null;
		InstructorId: number | null;
		CourseId: number | null;
		CreatedBy: number | null;
		CreatedOn: Date | null;
		Course: CoursesModels.MasterModel;
		Instructor: InstructorModels.MasterModel;
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
		CreatedBy: number | null;
		@ApiProperty()
		IsDeleted: boolean | null;
	}
}
