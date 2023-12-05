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
import { ClassOccurance } from './ClassOccurance';
import { User } from './User';

@Index('Class_FK', ['CourseId'], {})
@Entity('Class', { schema: 'mydb' })
export class Class {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((Class: Class) => Class.Course)
	@Column('int', { name: 'CourseId', nullable: true })
	CourseId: number | null;

	@Column('date', { name: 'StartDate' })
	StartDate: string;

	@Column('date', { name: 'EndDate' })
	EndDate: string;

	@Column('int', { name: 'MaxCapacity', nullable: true })
	MaxCapacity: number | null;

	@Column('varchar', { name: 'Period', nullable: true, length: 255 })
	Period: string | null;

	@Column('int', { name: 'CurrentIndex', nullable: true })
	CurrentIndex: number | null;

	@Column('tinyint', { name: 'IsActive', nullable: true, width: 1 })
	IsActive: boolean | null;

	@Column('tinyint', { name: 'IsDeleted', nullable: true, width: 1 })
	IsDeleted: boolean | null;

	@ManyToOne(() => Course, (Course) => Course.Classes, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;

	@OneToMany(() => ClassOccurance, (ClassOccurance) => ClassOccurance.Class)
	ClassOccurances: ClassOccurance[];

	@ManyToMany(() => User, (User) => User.Classes)
	Users: User[];
}
