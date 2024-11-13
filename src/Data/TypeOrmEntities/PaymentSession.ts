import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PaymentSession', { schema: 'mydb' })
export class PaymentSession {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('text', { name: 'SessionObject' })
	SessionObject: string;
}
