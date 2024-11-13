import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@App/Data/TypeOrmEntities/Payment';
import { PaymentModels } from './Payment.Models';

@Injectable()
export class PaymentRepository {
	constructor(
		@InjectRepository(Payment)
		private paymentRepository: Repository<Payment>
	) {}

	async GetByUserId(userId: number): Promise<Payment[]> {
		return this.paymentRepository.find({
			where: {
				UserId: userId
			},
			select: {
				Id: true,
				RefrenceNumber: true,
				CreatedOn: true,
				Currency: true,
				TotalAmount: true
			}
		});
	}

	async Create(paymentData: PaymentModels.MasterModel): Promise<PaymentModels.MasterModel> {
		const newPayment = this.paymentRepository.create({
			...paymentData
		});
		return await this.paymentRepository.save(newPayment);
	}
}
