import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ContactUsModels } from './ContactUs.Models';
import { ContactUsService } from './ContactUs.Service';

@ApiTags('ContactUs')
@Controller('contact-us')
export class ContactUsController {
	constructor(private ContactUsService: ContactUsService) {}

	@Post('')
	@ApiBody({ type: ContactUsModels.ContactUsReqModel })
	Create(@Body() contactus: ContactUsModels.ContactUsReqModel): Promise<ContactUsModels.MasterModel> {
		return this.ContactUsService.Create(contactus);
	}
}
