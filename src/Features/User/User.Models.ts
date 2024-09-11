import { NotificationModels } from '../-Notifications/Notifications2.Models';
import { CartModels } from '../Cart/Cart.Models';
import { ClassModels } from '../Class/Class.Models';
import { CoursesModels, CourseType } from '../Courses/Courses.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';
import { RatingModels } from '../Rating/Rating.Models';
import { LiveSessionModels, RecordedSessionModels } from '../Session/Session.Models';
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
		IsSocial: boolean;
		ProfilePicturePath: string;

		Carts: CartModels.MasterModel[];
		CreatedClasses: ClassModels.MasterModel[];
		Courses: CoursesModels.MasterModel[];

		Feedbacks: FeedbackModels.MasterModel[];
		Instructors: InstructorModels.MasterModel[];
		CreayedInstractor: InstructorModels.MasterModel[];
		NotificationSubscriptions: NotificationModels.NotificationSubscriptions[];
		NotificationTemplates: NotificationModels.NotificationTemplate[];
		Ratings: RatingModels.MasterModel[]; //youssef fix this when you add the rating
		UserClasses: UserClass[];
		UserCourses: UserCourse[];

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

	export class UserClass {
		UserId: number;
		ClassId: number;
		IsPaid: boolean;
		CreatedOn: Date | null;
		User: UserModels.MasterModel;
		Class: ClassModels.MasterModel;
	}

	export class UserCourse {
		UserId: number;
		CourseId: number;
		CreatedOn: Date | null;
		Course: CoursesModels.MasterModel;
		User: UserModels.MasterModel;
	}
}
