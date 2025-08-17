import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { CartItem } from './CartItem';
import { Class } from './Class';
import { CourseLanguage } from './CourseLanguage';
import { CourseLevel } from './CourseLevel';
import { CourseType } from './CourseType';
import { Instructor } from './Instructor';
import { User } from './User';
import { Feedback } from './Feedback';
import { RecordedSession } from './RecordedSession';
import { UserCourse } from './UserCourse';

@Index('Course_Instructor_FK', ['InstructorId'], {})
@Index('Course_CourseType_FK', ['TypeId'], {})
@Index('fk_Course_created_by', ['CreatedBy'], {})
@Index('Course_CourseLevel_FK', ['LevelId'], {})
@Index('Course_CourseLanguage_FK', ['LanguageId'], {})
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

	@Column('int', { name: 'LevelId', nullable: true })
	LevelId: number | null;

	@Column('int', { name: 'LanguageId', nullable: true })
	LanguageId: number | null;

	@Column('varchar', { name: 'ImageUrl', nullable: true, length: 255 })
	ImageUrl: string | null;

	@Column('varchar', { name: 'VideoPath', nullable: true, length: 255 })
	VideoPath: string | null;

	@Column('varchar', { name: 'FreeFilePath', nullable: true, length: 255 })
	FreeFilePath: string | null;

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

	@Column('text', { name: 'ToBeLearned', nullable: true })
	ToBeLearned: string | null;

	@Column('float', { name: 'Price', nullable: false, precision: 12 })
	Price: number;

	@Column('float', {
		name: 'PriceBeforeDiscount',
		nullable: true,
		precision: 12
	})
	PriceBeforeDiscount: number | null;

	@Column('text', { name: 'Prerequisite', nullable: true })
	Prerequisite: string | null;

	@Column('tinyint', { name: 'IsLive', default: () => "'1'" })
	IsLive: boolean;

	@Column('datetime', { name: 'CreatedOn', default: () => 'CURRENT_TIMESTAMP' })
	CreatedOn: Date;

	@Column('datetime', { name: 'UpdatedOn', default: () => 'CURRENT_TIMESTAMP' })
	UpdatedOn: Date;

	@RelationId((Course: Course) => Course.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@OneToMany(() => CartItem, (CartItem) => CartItem.Course)
	CartItems: CartItem[];

	@OneToMany(() => Class, (Class) => Class.Course)
	Classes: Class[];

	@ManyToOne(() => CourseLanguage, (CourseLanguage) => CourseLanguage.Courses, {
		onDelete: 'RESTRICT',
		onUpdate: 'RESTRICT'
	})
	@JoinColumn([{ name: 'LanguageId', referencedColumnName: 'Id' }])
	Language: CourseLanguage;

	@ManyToOne(() => CourseLevel, (CourseLevel) => CourseLevel.Courses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'LevelId', referencedColumnName: 'Id' }])
	Level: CourseLevel;

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

	@ManyToOne(() => User, (User) => User.Courses, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;

	@OneToMany(() => Feedback, (Feedback) => Feedback.Course)
	Feedbacks: Feedback[];

	@OneToMany(() => RecordedSession, (RecordedSession) => RecordedSession.Course)
	RecordedSessions: RecordedSession[];

	@OneToMany(() => UserCourse, (UserCourse) => UserCourse.User)
	UserCourses: UserCourse[];
}
