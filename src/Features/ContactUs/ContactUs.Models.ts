import { ApiProperty } from '@nestjs/swagger';

export namespace ContactUsModels {
	export class MasterModel {
		Id: number;
		Email: string;
		FirstName: string;
		LastName: string;
		Description: string;
	}

	export class ContactUsReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Email: string;
		@ApiProperty()
		FirstName: string;
		@ApiProperty()
		LastName: string;
		@ApiProperty()
		Description: string;
	}
}
