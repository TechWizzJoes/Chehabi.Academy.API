import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactUs } from '@App/Data/TypeOrmEntities/ContactUs';
import { ContactUsModels } from './ContactUs.Models';

@Injectable()
export class ContactUsRepository {
	constructor(
		@InjectRepository(ContactUs)
		private contactusRepository: Repository<ContactUs>
	) {}

	async Create(contactusData: ContactUsModels.ContactUsReqModel): Promise<ContactUs> {
		const newContactUs = this.contactusRepository.create({
			...contactusData
		});
		return await this.contactusRepository.save(newContactUs);
	}
}
