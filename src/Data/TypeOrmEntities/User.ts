import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './Cart';
import { Class } from './Class';
import { Course } from './Course';
import { Feedback } from './Feedback';
import { Instructor } from './Instructor';
import { NotificationSubscriptions } from './NotificationSubscriptions';
import { NotificationTemplate } from './NotificationTemplate';
import { Rating } from './Rating';
import { UserClass } from './UserClass';
import { UserCourse } from './UserCourse';
import { WhatsNew } from './WhatsNew';

@Index('Email', ['Email'], { unique: true })
@Entity('User', { schema: 'mydb' })
export class User {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'FirstName', length: 255 })
	FirstName: string;

	@Column('varchar', { name: 'LastName', length: 255 })
	LastName: string;

	@Column('date', { name: 'Birthdate', nullable: true })
	Birthdate: string | null;

	@Column('tinyint', { name: 'IsActive', nullable: true, width: 1 })
	IsActive: boolean | null;

	@Column('tinyint', { name: 'IsDeleted', nullable: true, width: 1 })
	IsDeleted: boolean | null;

	@Column('tinyint', {
		name: 'IsSocial',
		nullable: true,
		width: 1,
		default: () => "'0'"
	})
	IsSocial: boolean | null;

	@Column('varchar', { name: 'Email', unique: true, length: 255 })
	Email: string;

	@Column('varchar', { name: 'Password', length: 255 })
	Password: string;

	@Column('tinyint', { name: 'IsAdmin', width: 1, default: () => "'0'" })
	IsAdmin: boolean;

	@Column('varchar', {
		name: 'ProfilePicturePath',
		nullable: true,
		length: 100
	})
	ProfilePicturePath: string | null;

	@OneToMany(() => Cart, (Cart) => Cart.User)
	Carts: Cart[];

	@OneToMany(() => Class, (Class) => Class.CreatedBy)
	CreatedClasses: Class[];

	@OneToMany(() => Course, (Course) => Course.CreatedBy)
	Courses: Course[];

	@OneToMany(() => Feedback, (Feedback) => Feedback.CreatedBy)
	Feedbacks: Feedback[];

	@OneToMany(() => Instructor, (Instructor) => Instructor.User)
	Instructors: Instructor[];

	@OneToMany(() => Instructor, (Instructor) => Instructor.CreatedBy)
	CreayedInstractor: Instructor[];

	@OneToMany(() => NotificationSubscriptions, (NotificationSubscriptions) => NotificationSubscriptions.User)
	NotificationSubscriptions: NotificationSubscriptions[];

	@OneToMany(() => NotificationTemplate, (NotificationTemplate) => NotificationTemplate.CreatedBy)
	NotificationTemplates: NotificationTemplate[];

	@OneToMany(() => Rating, (Rating) => Rating.User)
	Ratings: Rating[];

	@OneToMany(() => UserClass, (UserClass) => UserClass.User)
	UserClasses: UserClass[];

	@OneToMany(() => UserCourse, (UserCourse) => UserCourse.User)
	UserCourses: UserCourse[];

	@OneToMany(() => WhatsNew, (WhatsNew) => WhatsNew.CreatedBy)
	WhatsNews: WhatsNew[];
}
