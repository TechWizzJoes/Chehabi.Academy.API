import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { InstructorModels } from '../User/Instructor.Models';

export namespace FeedbackModels {
	export class MasterModel {
		Id: number;
		Text: string | null;
		Rating: number;
		IsDeleted: boolean | null;
		InstructorId: number | null;
		CourseId: number | null;
		CreatedBy: number | null;
		CreatedOn: Date | null;
		Course: CoursesModels.MasterModel;
		Instructor: InstructorModels.MasterModel;
		User: UserModels.MasterModel;
	}

	export class ReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Text: string | null;
		@ApiProperty()
		Rating: number;
		@ApiProperty()
		CourseId: number;

		CreatedBy: number | null;
	}
}
