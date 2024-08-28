import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity('CourseType', { schema: 'mydb' })
export class CourseType {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'Code' })
	Code: number;

	@Column('varchar', { name: 'Text', length: 100 })
	Text: string;

	@OneToMany(() => Course, (Course) => Course.Type)
	Courses: Course[];
}
