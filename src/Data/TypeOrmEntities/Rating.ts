import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Index('IDX_Rating_Course', ['CourseId'], {})
@Index('IDX_Rating_User', ['UserId'], {})
@Entity('Rating', { schema: 'mydb' })
export class Rating {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((Rating: Rating) => Rating.Course)
	@Column('int', { name: 'CourseId' })
	CourseId: number;

	@RelationId((Rating: Rating) => Rating.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

	@Column('float', { name: 'Rating', precision: 12 })
	Rating: number;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@ManyToOne(() => Course, (Course) => Course.Ratings, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;

	@ManyToOne(() => User, (User) => User.Ratings, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;
}
