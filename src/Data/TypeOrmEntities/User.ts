import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';
import { Feedback } from './Feedback';
import { Class } from './Class';

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

	@Column('varchar', { name: 'Email', unique: true, length: 255 })
	Email: string;

	@Column('varchar', { name: 'Password', length: 255 })
	Password: string;

	@Column('tinyint', { name: 'IsAdmin', default: () => "'b'0''" })
	IsAdmin: boolean;

	@Column('varchar', {
		name: 'ProfilePicturePath',
		nullable: true,
		length: 100
	})
	ProfilePicturePath: string | null;

	@OneToMany(() => Course, (Course) => Course.Instructor)
	Courses: Course[];

	@OneToMany(() => Feedback, (Feedback) => Feedback.User)
	Feedbacks: Feedback[];

	@ManyToMany(() => Class, (Class) => Class.Users)
	@JoinTable({
		name: 'User_Class',
		joinColumns: [{ name: 'UserId', referencedColumnName: 'Id' }],
		inverseJoinColumns: [{ name: 'ClassId', referencedColumnName: 'Id' }],
		schema: 'mydb'
	})
	Classes: Class[];
}
