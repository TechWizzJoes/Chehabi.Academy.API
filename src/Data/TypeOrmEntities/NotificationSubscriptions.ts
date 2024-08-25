import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('fk_NotificationSubscriptions_created_by', ['CreatedBy'], {})
@Entity('NotificationSubscriptions', { schema: 'mydb' })
export class NotificationSubscriptions {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;

	@Column('longtext', { name: 'Subscription' })
	Subscription: string;

	@RelationId((NotificationSubscriptions: NotificationSubscriptions) => NotificationSubscriptions.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@ManyToOne(() => User, (User) => User.NotificationSubscriptions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;
}
