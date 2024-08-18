import { ClassModels } from '../Class/Class.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';
import { WhatsNewModels } from '../WhatsNew/WhatsNew.Models';
import { InstructorModels } from './Instructor.Models';

export namespace UserModels {
	export class MasterModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate: string;
		IsActive: boolean;
		IsDeleted: boolean;
		Email: string;
		Password: string;
		IsAdmin: boolean;
		ProfilePicturePath: string;
		Classes: ClassModels.MasterModel[];
		Feedbacks: FeedbackModels.MasterModel[];
		Instructors: InstructorModels.MasterModel[];
		WhatsNews: WhatsNewModels.MasterModel[];
	}

	export class UserResModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate?: string;
		Email: string;
		ProfilePicturePath: string;
	}

	export class UserReqModel {
		Id: number;
		FirstName: string;
		LastName: string;
		Birthdate?: string;
		Email: string;
		ProfilePicturePath: string;
	}
}
