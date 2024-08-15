import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	RelationId
} from 'typeorm';
import { Course } from './Course';
import { LiveSession } from './LiveSession';
import { User } from './User';
import { BooleanTransformer } from '@App/Common/Transformers/Boolean.Transformer';

@Index('Class_FK', ['CourseId'], {})
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

	@Column('int', { name: 'CurrentIndex', nullable: true })
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

	@ManyToOne(() => Course, (Course) => Course.Classes, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;

	@OneToMany(() => LiveSession, (LiveSession) => LiveSession.Class)
	LiveSessions: LiveSession[];

	@ManyToMany(() => User, (User) => User.Classes)
	Users: User[];
}
