import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './Course';

@Entity('CourseLanguage', { schema: 'mydb' })
export class CourseLanguage {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'Code' })
	Code: number;

	@Column('varchar', { name: 'Text', length: 100 })
	Text: string;

	@OneToMany(() => Course, (Course) => Course.Language)
	Courses: Course[];
}
