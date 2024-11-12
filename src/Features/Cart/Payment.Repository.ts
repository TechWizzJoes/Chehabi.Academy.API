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

	// async GetByUserId(userId: number): Promise<Cart> {
	// 	return this.cartRepository.findOne({
	// 		relations: ['CartItems.Class', 'CartItems.Course'],
	// 		where: {
	// 			UserId: userId
	// 		}
	// 	});
	// }

	async Create(paymentData: PaymentModels.MasterModel): Promise<PaymentModels.MasterModel> {
		const newPayment = this.paymentRepository.create({
			...paymentData
		});
		return await this.paymentRepository.save(newPayment);
	}
}
