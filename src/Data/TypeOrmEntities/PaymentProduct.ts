import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Class } from './Class';
import { Payment } from './Payment';

@Index('PaymentProduct_Class_FK', ['ClassId'], {})
@Entity('PaymentProduct', { schema: 'mydb' })
export class PaymentProduct {
	@RelationId((PaymentProduct: PaymentProduct) => PaymentProduct.Payment)
	@Column('int', { primary: true, name: 'PaymentId' })
	PaymentId: number;

	@RelationId((PaymentProduct: PaymentProduct) => PaymentProduct.Class)
	@Column('int', { primary: true, name: 'ClassId' })
	ClassId: number;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => Class, (Class) => Class.PaymentProducts, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;

	@ManyToOne(() => Payment, (Payment) => Payment.PaymentProducts, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'PaymentId', referencedColumnName: 'Id' }])
	Payment: Payment;
}
