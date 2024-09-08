import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CartItem } from './CartItem';
import { Course } from './Course';
import { User } from './User';
import { LiveSession } from './LiveSession';
import { UserClass } from './UserClass';
import { BooleanTransformer } from '@App/Common/Transformers/Boolean.Transformer';

@Index('Class_FK', ['CourseId'], {})
@Index('Class_User_FK', ['CreatedBy'], {})
@Entity('Class', { schema: 'mydb' })
export class Class {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'Name', nullable: true, length: 100 })
	Name: string | null;

	@RelationId((Class: Class) => Class.Course)
	@Column('int', { name: 'CourseId', nullable: true })
	CourseId: number | null;

	@Column('datetime', { name: 'StartDate' })
	StartDate: Date;

	@Column('datetime', { name: 'EndDate' })
	EndDate: Date;

	@Column('int', { name: 'MaxCapacity', nullable: true })
	MaxCapacity: number | null;

	@Column('int', { name: 'CurrentIndex', nullable: true, default: () => "'0'" })
	CurrentIndex: number | null;

	@Column('int', { name: 'NumberOfSessions', nullable: true })
	NumberOfSessions: number | null;

	@Column('tinyint', {
		name: 'IsActive',
		nullable: true,
		width: 1,
		default: () => "'1'",
		transformer: new BooleanTransformer()
	})
	IsActive: boolean | null;

	@Column('tinyint', {
		name: 'IsDeleted',
		nullable: true,
		width: 1,
		default: () => "'0'"
	})
	IsDeleted: boolean | null;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@Column('datetime', {
		name: 'UpdatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	UpdatedOn: Date | null;

	@RelationId((Class: Class) => Class.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@OneToMany(() => CartItem, (CartItem) => CartItem.Class)
	CartItems: CartItem[];

	@ManyToOne(() => Course, (Course) => Course.Classes, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;

	@ManyToOne(() => User, (User) => User.CreatedClasses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;

	@OneToMany(() => LiveSession, (LiveSession) => LiveSession.Class)
	LiveSessions: LiveSession[];

	@OneToMany(() => UserClass, (UserClass) => UserClass.Class)
	UserClasses: UserClass[];
}
