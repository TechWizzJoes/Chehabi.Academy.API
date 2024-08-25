import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Course } from './Course';
import { Feedback } from './Feedback';
import { User } from './User';

@Index('Instructor_FK', ['UserId'], {})
@Index('fk_Instructor_created_by', ['CreatedBy'], {})
@Entity('Instructor', { schema: 'mydb' })
export class Instructor {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((Instructor: Instructor) => Instructor.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

	@RelationId((Instructor: Instructor) => Instructor.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@OneToMany(() => Course, (Course) => Course.Instructor)
	Courses: Course[];

	@OneToMany(() => Feedback, (Feedback) => Feedback.Instructor)
	Feedbacks: Feedback[];

	@ManyToOne(() => User, (User) => User.Instructors, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;

	@ManyToOne(() => User, (User) => User.Instructors, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;
}
