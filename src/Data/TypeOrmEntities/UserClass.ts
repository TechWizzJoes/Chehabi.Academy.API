import { Column, Entity, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { User } from './User';
import { Class } from './Class';

@Index('ClassId', ['ClassId'], {})
@Entity('User_Class', { schema: 'mydb' })
export class UserClass {
	@RelationId((UserClass: UserClass) => UserClass.User)
	@Column('int', { primary: true, name: 'UserId' })
	UserId: number;

	@RelationId((UserClass: UserClass) => UserClass.Class)
	@Column('int', { primary: true, name: 'ClassId' })
	ClassId: number;

	@Column('tinyint', { name: 'IsPaid', width: 1, default: () => "'0'" })
	IsPaid: boolean;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => User, (User) => User.UserClasses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;

	@ManyToOne(() => Class, (Class) => Class.UserClasses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;
}
