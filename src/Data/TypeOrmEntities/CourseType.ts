import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Course } from './Course';
import { User } from './User';

@Index('fk_CourseType_created_by', ['CreatedBy'], {})
@Entity('CourseType', { schema: 'mydb' })
export class CourseType {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'Code' })
	Code: number;

	@Column('varchar', { name: 'Text', length: 100 })
	Text: string;

	@RelationId((CourseType: CourseType) => CourseType.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@OneToMany(() => Course, (Course) => Course.TypeId)
	Courses: Course[];

	@ManyToOne(() => User, (User) => User.CourseTypes, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;
}
