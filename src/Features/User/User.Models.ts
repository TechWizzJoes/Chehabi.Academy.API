import { NotificationModels } from '../-Notifications/Notifications2.Models';
import { ClassModels } from '../Class/Class.Models';
import { CoursesModels, CourseType } from '../Courses/Courses.Models';
import { FeedbackModels } from '../Feedback/Feedback.Models';
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

		Classes: ClassModels.MasterModel[];
		Feedbacks: FeedbackModels.MasterModel[];
		Instructors: InstructorModels.MasterModel[];
		WhatsNews: WhatsNewModels.MasterModel[];

		RecordedSessions: RecordedSessionModels.MasterModel[];
		NotificationTemplates: NotificationModels.NotificationTemplate[];
		NotificationSubscriptions: NotificationModels.NotificationSubscriptions[];
		LiveSessions: LiveSessionModels.MasterModel[];
		CreayedInstractor: InstructorModels.MasterModel[];
		CourseTypes: CourseType[];
		Courses: CoursesModels.MasterModel[];
		CreatedClasses: ClassModels.MasterModel[];
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
