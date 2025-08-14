import { ApiProperty } from '@nestjs/swagger';
import { LiveSessionModels } from '../Session/Session.Models';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { CartModels } from '../Cart/Cart.Models';
import { PaymentModels } from '../Payment/Payment.Models';

export namespace ClassModels {
	export class MasterModel {
		Id: number;
		Name: string | null;
		CourseId: number | null;
		StartDate: Date | null;
		EndDate: Date | null;
		MaxCapacity: number | null;
		CurrentIndex: number | null;
		NumberOfSessions: number | null;

		IsActive: boolean | null;
		IsDeleted: boolean | null;
		HasFreeTrial: boolean | null;
		CreatedOn: Date | null;
		UpdatedOn: Date | null;

		CreatedBy: number | null;
		Creator: UserModels.MasterModel;

		CartItems: CartModels.CartItem[];

		Course: CoursesModels.MasterModel;
		LiveSessions: LiveSessionModels.MasterModel[];
		UserClasses: UserModels.UserClass[];
		PaymentProducts: PaymentModels.PaymentProduct[];

		AvailableSlots?: number;
		IsJoined?: boolean; // for joined badge display
		IsJoinedFreeTrial?: boolean; // for joined badge display
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ClassReqModel implements Partial<MasterModel> {
		@ApiProperty()
		CourseId: number;
		@ApiProperty()
		StartDate: Date | null;
		@ApiProperty()
		MaxCapacity: number | null;
		@ApiProperty()
		Period: PeriodDto[] = [new PeriodDto()];
		@ApiProperty()
		CurrentIndex: number | null;
		@ApiProperty()
		IsActive: boolean | null;
		@ApiProperty()
		NumberOfSessions: number | null;
		@ApiProperty()
		LiveSessions: LiveSessionModels.MasterModel[];
		@ApiProperty()
		HasFreeTrial: boolean | null;
		@ApiProperty()
		UTCHoursOffset!: number;

		EndDate: Date;
		IsDeleted: boolean;
		CreatedBy: number;
	}

	export class PeriodDto {
		Day: number;
		Time: string;
		DurationInMins: number;
	}

	export class SessionDates {
		Date: Date;
		DurationInMins: number;
	}
}
