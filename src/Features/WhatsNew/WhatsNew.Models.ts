import { ApiProperty } from '@nestjs/swagger';
import { ClassModels } from '../Class/Class.Models';

export namespace WhatsNewModels {
	export class MasterModel {
		Id: number;
		Title: string | null;
		Text: string | null;
		PicturePath: string | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
	}

	export class WhatsNewReqModel implements Partial<MasterModel> {
		@ApiProperty()
		Title: string | null;
		@ApiProperty()
		Text: string | null;
		@ApiProperty()
		PicturePath: string | null;
	}
}
