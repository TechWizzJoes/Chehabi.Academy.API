import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('Payments_UNIQUE', ['StripePaymentIntent'], { unique: true })
@Entity('Payment', { schema: 'mydb' })
export class Payment {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'StripeSessionId', unique: true, length: 100 })
	StripeSessionId: string;

	@Column('varchar', { name: 'StripePaymentIntent', unique: true, length: 100 })
	StripePaymentIntent: string;

	@Column('varchar', { name: 'RefrenceNumber', length: 100 })
	RefrenceNumber: string;

	@Column('varchar', { name: 'Currency', length: 100 })
	Currency: string;

	@Column('varchar', { name: 'TotalAmount', length: 100 })
	TotalAmount: string;

	@Column('varchar', { name: 'PaymentMethod', length: 100 })
	PaymentMethod: string;

	@Column('varchar', { name: 'PaymentEmail', length: 100 })
	PaymentEmail: string;

	@Column('varchar', { name: 'PaymentPhone', nullable: true, length: 100 })
	PaymentPhone: string | null;

	@Column('varchar', { name: 'PaymentName', length: 100 })
	PaymentName: string;
}
