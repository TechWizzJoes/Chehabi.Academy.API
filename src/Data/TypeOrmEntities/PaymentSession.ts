import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Payment } from './Payment';

@Entity('PaymentSession', { schema: 'mydb' })
export class PaymentSession {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('text', { name: 'SessionObject' })
	SessionObject: string;

	@OneToOne(() => Payment, (Payment) => Payment.PaymentSession)
	Payment: Payment;
}
