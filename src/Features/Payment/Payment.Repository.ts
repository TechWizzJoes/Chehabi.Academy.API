import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '@App/Data/TypeOrmEntities/Payment';
import { PaymentModels } from './Payment.Models';
import { PaymentSession } from '@App/Data/TypeOrmEntities/PaymentSession';
import { PaymentProduct } from '@App/Data/TypeOrmEntities/PaymentProduct';

@Injectable()
export class PaymentRepository {
	constructor(
		@InjectRepository(Payment)
		private paymentRepository: Repository<Payment>,
		@InjectRepository(PaymentSession)
		private paymentSessionRepository: Repository<PaymentSession>,
		@InjectRepository(PaymentProduct)
		private paymentProductRepository: Repository<PaymentProduct>
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
			},
			order: {
				CreatedOn: 'desc'
			}
		});
	}

	async Create(paymentData: PaymentModels.MasterModel): Promise<PaymentModels.MasterModel> {
		const newPayment = this.paymentRepository.create({
			...paymentData
		});
		return await this.paymentRepository.save(newPayment);
	}

	async CreatePaymentSession(paymentData: PaymentModels.PaymentSession): Promise<PaymentModels.PaymentSession> {
		const newPayment = this.paymentSessionRepository.create({
			...paymentData
		});
		return await this.paymentSessionRepository.save(newPayment);
	}

	async CreatePaymentProduct(classId: number, paymentId: number) {
		const newPayment = this.paymentProductRepository.create({
			ClassId: classId,
			PaymentId: paymentId
		});
		return await this.paymentProductRepository.save(newPayment);
	}
}
