import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('NotificationSubscriptions', { schema: 'mydb' })
export class NotificationSubscriptions {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;

	@Column('varchar', { name: 'Subscription', length: 100 })
	Subscription: string;
}
