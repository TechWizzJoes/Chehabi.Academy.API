import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Course } from './Course';
import { User } from './User';
import { Instructor } from './Instructor';

@Index('UserId', ['CreatedBy'], {})
@Index('Feedback_Instructor_FK', ['InstructorId'], {})
@Index('Feedback_Course_FK', ['CourseId'], {})
@Entity('Feedback', { schema: 'mydb' })
export class Feedback {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('text', { name: 'Text', nullable: true })
	Text: string | null;

	@Column('tinyint', { name: 'IsDeleted', nullable: true, width: 1 })
	IsDeleted: boolean | null;

	@RelationId((Feedback: Feedback) => Feedback.Instructor)
	@Column('int', { name: 'InstructorId', nullable: true })
	InstructorId: number | null;

	@RelationId((Feedback: Feedback) => Feedback.Course)
	@Column('int', { name: 'CourseId', nullable: true })
	CourseId: number | null;

	@RelationId((Feedback: Feedback) => Feedback.User)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => Course, (Course) => Course.Feedbacks, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;

	@ManyToOne(() => User, (User) => User.Feedbacks, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	User: User;

	@ManyToOne(() => Instructor, (Instructor) => Instructor.Feedbacks, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'InstructorId', referencedColumnName: 'Id' }])
	Instructor: Instructor;
}
