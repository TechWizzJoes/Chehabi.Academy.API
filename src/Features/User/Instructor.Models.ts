import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';

export namespace InstructorModels {
	export class MasterModel {
		Id: number;
		UserId: number;
		Courses: CoursesModels.MasterModel[];
		Feedbacks: FeedbackModels.MasterModel[];
		User: User;
		CreatedBy: number | null;
		Creator: UserModels.MasterModel;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ReqModel implements Partial<MasterModel> {
		@ApiProperty()
		UserId: number | null;
	}
}
