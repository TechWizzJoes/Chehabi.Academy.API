import { User } from '@App/Data/TypeOrmEntities/User';
import { ApiProperty } from '@nestjs/swagger';
import { LiveSessionModels } from '../Session/Session.Models';
import { AccountModels } from '../Account/Account.Models';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';

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
		CreatedOn: Date | null;
		UpdatedOn: Date | null;

		Users: UserModels.MasterModel[];
		Course: CoursesModels.MasterModel;
		LiveSessions: LiveSessionModels.MasterModel[];
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

		EndDate: Date | null;
		IsDeleted: boolean | null;
	}

	export class PeriodDto {
		Day: number = 0;
		Time!: string;
	}
}
