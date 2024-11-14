import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { PaymentSession } from './PaymentSession';
import { User } from './User';
import { PaymentProduct } from './PaymentProduct';

@Index('Payments_UNIQUE', ['StripePaymentIntent'], { unique: true })
@Index('Payment_User_FK', ['UserId'], {})
@Index('Payment_PaymentSession_FK', ['PaymentSessionId'], {})
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

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@RelationId((Payment: Payment) => Payment.PaymentSession)
	@Column('int', { name: 'PaymentSessionId' })
	PaymentSessionId: number;

	@ManyToOne(() => PaymentSession, (PaymentSession) => PaymentSession.Payment, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'PaymentSessionId', referencedColumnName: 'Id' }])
	PaymentSession: PaymentSession;

	@ManyToOne(() => User, (User) => User.Payments, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;

	@OneToMany(() => PaymentProduct, (PaymentProduct) => PaymentProduct.Payment)
	PaymentProducts: PaymentProduct[];
}
