import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';
import { RecordedSessionModels } from '../Session/Session.Models';
import { InstructorModels } from '../User/Instructor.Models';
import { CourseTypeEnum } from '@App/Common/Enums/CourseType.Enum';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';

export namespace RatingModels {
	export class MasterModel {
		Id: number;
		CourseId: number;
		UserId: number;
		Rating: number;
		CreatedOn: Date | null;
		Course: CoursesModels.MasterModel;
		User: UserModels.MasterModel;
	}

	export type EntityModel = Omit<MasterModel, ''>;

	export class RatingReqModel implements Partial<MasterModel> {
		@ApiProperty()
		CourseId: number;

		@ApiProperty()
		UserId: number;

		@ApiProperty()
		Rating: number;

		@ApiProperty()
		CreatedOn: Date;
	}

	export class RatingResModel implements Partial<MasterModel> {
		@ApiProperty()
		CourseId: number;

		@ApiProperty()
		UserId: number;

		@ApiProperty()
		Rating: number;

		@ApiProperty()
		CreatedOn: Date;
	}
}
