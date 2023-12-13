import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsNew } from '@App/Data/TypeOrmEntities/WhatsNew';
import { WhatsNewModels } from './WhatsNew.Models';

@Injectable()
export class WhatsNewRepository {
	constructor(
		@InjectRepository(WhatsNew)
		private whatsNewRepository: Repository<WhatsNew>
	) {}

	async GetAll(): Promise<WhatsNew[]> {
		return this.whatsNewRepository.find({
			where: {
				IsDeleted: false,
				IsActive: true
			}
		});
	}

	async GetById(id: number): Promise<WhatsNew> {
		return this.whatsNewRepository.findOne({
			where: {
				Id: id,
				IsActive: true
			}
		});
	}

	async Create(whatsNewData: WhatsNewModels.WhatsNewReqModel): Promise<WhatsNew> {
		const newWhatsNew = this.whatsNewRepository.create({
			...whatsNewData,
			IsActive: true,
			IsDeleted: false
		});
		return await this.whatsNewRepository.save(newWhatsNew);
	}

	async Update(id: number, whatsNewData: WhatsNewModels.WhatsNewReqModel): Promise<WhatsNew> {
		let updateWhatsNew: WhatsNew = await this.whatsNewRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateWhatsNew) {
			// handle case where the whatsNew is not found
			return null;
		}

		updateWhatsNew = {
			...updateWhatsNew,
			...whatsNewData
		};

		return await this.whatsNewRepository.save(updateWhatsNew);
	}

	async Delete(id: number): Promise<WhatsNew> {
		let deleteWhatsNew: WhatsNew = await this.whatsNewRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!deleteWhatsNew) {
			// handle case where the whatsNew is not found
			return null;
		}

		deleteWhatsNew.IsActive = false;
		deleteWhatsNew.IsDeleted = true;

		return await this.whatsNewRepository.save(deleteWhatsNew);
	}
}
