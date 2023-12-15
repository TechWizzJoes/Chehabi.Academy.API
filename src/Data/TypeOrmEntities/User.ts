import {
	Column,
	Entity,
	Index,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
	ValueTransformer
} from 'typeorm';
import { Course } from './Course';
import { Feedback } from './Feedback';
import { Class } from './Class';

class BoolBitTransformer implements ValueTransformer {
	// To db from typeorm
	to(value: boolean | null): Buffer | null {
		if (value === null) {
			return null;
		}
		const res = new Buffer(1);
		res[0] = value ? 1 : 0;
		return res;
	}
	// From db to typeorm
	from(value: Buffer): boolean | null {
		if (value === null) {
			return null;
		}
		return value[0] === 1;
	}
}
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

	@Column('bit', { name: 'IsAdmin', default: () => "'b'0''", transformer: new BoolBitTransformer() })
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
