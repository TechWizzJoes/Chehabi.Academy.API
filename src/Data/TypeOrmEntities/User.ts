import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Class } from './Class';
import { Course } from './Course';
import { CourseType } from './CourseType';
import { Feedback } from './Feedback';
import { Instructor } from './Instructor';
import { LiveSession } from './LiveSession';
import { NotificationSubscriptions } from './NotificationSubscriptions';
import { NotificationTemplate } from './NotificationTemplate';
import { RecordedSession } from './RecordedSession';
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

	@OneToMany(() => Class, (Class) => Class.CreatedBy)
	CreatedClasses: Class[];

	@OneToMany(() => Course, (Course) => Course.CreatedBy)
	Courses: Course[];

	@OneToMany(() => CourseType, (CourseType) => CourseType.CreatedBy)
	CourseTypes: CourseType[];

	@OneToMany(() => Feedback, (Feedback) => Feedback.CreatedBy)
	Feedbacks: Feedback[];

	@OneToMany(() => Instructor, (Instructor) => Instructor.User)
	Instructors: Instructor[];

	@OneToMany(() => Instructor, (Instructor) => Instructor.CreatedBy)
	CreayedInstractor: Instructor[];

	@OneToMany(() => LiveSession, (LiveSession) => LiveSession.CreatedBy)
	LiveSessions: LiveSession[];

	@OneToMany(() => NotificationSubscriptions, (NotificationSubscriptions) => NotificationSubscriptions.CreatedBy)
	NotificationSubscriptions: NotificationSubscriptions[];

	@OneToMany(() => NotificationTemplate, (NotificationTemplate) => NotificationTemplate.CreatedBy)
	NotificationTemplates: NotificationTemplate[];

	@OneToMany(() => RecordedSession, (RecordedSession) => RecordedSession.CreatedBy)
	RecordedSessions: RecordedSession[];

	@ManyToMany(() => Class, (Class) => Class.Users)
	@JoinTable({
		name: 'User_Class',
		joinColumns: [{ name: 'UserId', referencedColumnName: 'Id' }],
		inverseJoinColumns: [{ name: 'ClassId', referencedColumnName: 'Id' }],
		schema: 'mydb'
	})
	Classes: Class[];

	@OneToMany(() => WhatsNew, (WhatsNew) => WhatsNew.CreatedBy)
	WhatsNews: WhatsNew[];
}
