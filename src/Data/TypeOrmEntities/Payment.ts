import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('Payments_UNIQUE', ['StripePaymentIntent'], { unique: true })
@Index('Payment_User_FK', ['UserId'], {})
@Entity('Payment', { schema: 'mydb' })
export class Payment {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'StripeSessionId', unique: true, length: 100 })
	StripeSessionId: string;

	@Column('varchar', { name: 'StripePaymentIntent', unique: true, length: 100 })
	StripePaymentIntent: string;

	@RelationId((Payment: Payment) => Payment.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

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

	@ManyToOne(() => User, (User) => User.Payments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
