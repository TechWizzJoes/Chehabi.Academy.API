import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';
import { RecordedSessionModels } from '../Session/Session.Models';
import { InstructorModels } from '../User/Instructor.Models';
import { CourseTypeEnum } from '@App/Common/Enums/CourseType.Enum';
import { UserModels } from '../User/User.Models';
import { CartModels } from '../Cart/Cart.Models';
import { RatingModels } from '../Rating/Rating.Models';

export namespace CoursesModels {
	export class MasterModel {
		Id: number;
		Name: string;
		Description: string | null;
		InstructorId: number | null;
		TypeId: number | null;
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
		IsLive: boolean;
		Classes: ClassModels.MasterModel[];
		Instructor: InstructorModels.MasterModel;
		Type: CourseType;
		Feedbacks: FeedbackModels.MasterModel[];
		RecordedSessions: RecordedSessionModels.MasterModel[];
		CreatedOn: Date;
		UpdatedOn: Date;
		CreatedBy: number | null;
		Creator: UserModels.MasterModel;
		UserCourses: UserModels.UserCourse[];
		CartItems: CartModels.CartItem[];
		Ratings: RatingModels.MasterModel[]; //youssef fix this when you add the ratings
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
		@ApiProperty()
		TypeIdString: string | null;
		@ApiProperty()
		IsActive: boolean | null;

		TypeId: number;
		IsDeleted: boolean | null;
		InstructorId: number | null;
	}

	export class Filter {
		SearchInput!: string;
		Rating!: number;
		Type!: string;
		Level: Levels = new Levels();
	}
	export class Levels {
		Beginner!: boolean;
		Intermediate!: boolean;
		Advanced!: boolean;
	}
}

export class CourseType {
	Id: number;
	Code: number;
	Text: string;
	Courses: CoursesModels.MasterModel[];
}
