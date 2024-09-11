import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Entity('User_Course', { schema: 'mydb' })
export class UserCourse {
	@RelationId((UserCourse: UserCourse) => UserCourse.User)
	@Column('int', { primary: true, name: 'UserId' })
	UserId: number;

	@RelationId((UserCourse: UserCourse) => UserCourse.Course)
	@Column('int', { primary: true, name: 'CourseId' })
	CourseId: number;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => Course, (Course) => Course.UserCourses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	Course: Course;

	@ManyToOne(() => User, (User) => User.UserCourses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
