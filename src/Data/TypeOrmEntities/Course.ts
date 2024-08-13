import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';
import { User } from './User';

@Index('Course_FK', ['InstructorId'], {})
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

	@Column('int', { name: 'Duration', nullable: true })
	Duration: number | null;

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

	@ManyToOne(() => User, (User) => User.Courses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'InstructorId', referencedColumnName: 'Id' }])
	Instructor: User;
}
