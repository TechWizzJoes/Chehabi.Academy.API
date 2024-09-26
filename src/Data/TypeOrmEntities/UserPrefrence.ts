import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('UserPrefrence_User_FK', ['UserId'], {})
@Entity('UserPrefrence', { schema: 'mydb' })
export class UserPrefrence {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((UserPrefrence: UserPrefrence) => UserPrefrence.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

	@Column('tinyint', {
		name: 'PromotionsNotify',
		width: 1,
		default: () => "'1'"
	})
	PromotionsNotify: boolean;

	@Column('tinyint', {
		name: 'SessionsReminderNotify',
		width: 1,
		default: () => "'1'"
	})
	SessionsReminderNotify: boolean;

	@Column('tinyint', {
		name: 'SessionsUpdateNotify',
		width: 1,
		default: () => "'1'"
	})
	SessionsUpdateNotify: boolean;

	@Column('tinyint', {
		name: 'InstructorsAnnouncementNotify',
		width: 1,
		default: () => "'1'"
	})
	InstructorsAnnouncementNotify: boolean;

	@OneToOne(() => User, (User) => User.UserPrefrence, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
