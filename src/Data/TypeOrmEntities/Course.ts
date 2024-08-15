import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';
import { CourseType } from './CourseType';
import { Instructor } from './Instructor';
import { Feedback } from './Feedback';
import { RecordedSession } from './RecordedSession';

@Index('Course_CourseType_FK', ['Type'], {})
@Index('Course_Instructor_FK', ['InstructorId'], {})
@Entity('Course', { schema: 'mydb' })
export class Course {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'Name', length: 255 })
	Name: string;

	@Column('text', { name: 'Description', nullable: true })
	Description: string | null;

	@RelationId((Course: Course) => Course.Instructor)
	@Column('int', { name: 'InstructorId' })
	InstructorId: number;

	@RelationId((Course: Course) => Course.Type)
	@Column('int', { name: 'TypeId', nullable: true })
	TypeId: number | null;

	@Column('varchar', { name: 'VideoPath', nullable: true, length: 255 })
	VideoPath: string | null;

	@Column('varchar', { name: 'FilePath', nullable: true, length: 255 })
	FilePath: string | null;

	@Column('datetime', { name: 'StartDate', nullable: true })
	StartDate: Date | null;

	@Column('tinyint', {
		name: 'IsActive',
		nullable: true,
		width: 1,
		default: () => "'1'"
	})
	IsActive: boolean | null;

	@Column('tinyint', {
		name: 'IsDeleted',
		nullable: true,
		width: 1,
		default: () => "'0'"
	})
	IsDeleted: boolean | null;

	@Column('float', { name: 'Rating', nullable: true, precision: 12 })
	Rating: number | null;

	@Column('int', { name: 'Raters', nullable: true })
	Raters: number | null;

	@Column('varchar', { name: 'ImageUrl', nullable: true, length: 255 })
	ImageUrl: string | null;

	@Column('text', { name: 'ToBeLearned', nullable: true })
	ToBeLearned: string | null;

	@Column('float', { name: 'Price', nullable: true, precision: 12 })
	Price: number | null;

	@Column('text', { name: 'Prerequisite', nullable: true })
	Prerequisite: string | null;

	@Column('tinyint', { name: 'IsLive', default: () => "'1'" })
	IsLive: boolean;

	@Column('datetime', { name: 'CreatedOn', default: () => 'CURRENT_TIMESTAMP' })
	CreatedOn: Date;

	@Column('datetime', { name: 'UpdatedOn', default: () => 'CURRENT_TIMESTAMP' })
	UpdatedOn: Date;

	@OneToMany(() => Class, (Class) => Class.Course)
	Classes: Class[];

	@ManyToOne(() => CourseType, (CourseType) => CourseType.Courses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'TypeId', referencedColumnName: 'Id' }])
	Type: CourseType;

	@ManyToOne(() => Instructor, (Instructor) => Instructor.Courses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'InstructorId', referencedColumnName: 'Id' }])
	Instructor: Instructor;

	@OneToMany(() => Feedback, (Feedback) => Feedback.Course)
	Feedbacks: Feedback[];

	@OneToMany(() => RecordedSession, (RecordedSession) => RecordedSession.Course)
	RecordedSessions: RecordedSession[];
}
