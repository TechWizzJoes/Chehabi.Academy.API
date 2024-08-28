import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('NotificationSubscriptions_User_FK', ['UserId'], {})
@Entity('NotificationSubscriptions', { schema: 'mydb' })
export class NotificationSubscriptions {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((NotificationSubscriptions: NotificationSubscriptions) => NotificationSubscriptions.User)
	@Column('int', { name: 'UserId', nullable: true })
	UserId: number | null;

	@Column('longtext', { name: 'Subscription' })
	Subscription: string;

	@ManyToOne(() => User, (User) => User.NotificationSubscriptions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
