import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('InAppNotification_User_FK', ['UserId'], {})
@Entity('InAppNotification', { schema: 'mydb' })
export class InAppNotification {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((InAppNotification: InAppNotification) => InAppNotification.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

	@Column('varchar', { name: 'Text', length: 100 })
	Text: string;

	@Column('tinyint', { name: 'IsRead', width: 1, default: () => "'0'" })
	IsRead: boolean;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => User, (User) => User.InAppNotification, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
