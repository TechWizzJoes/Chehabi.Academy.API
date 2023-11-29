import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClassOccurance } from './ClassOccurance';
import { User } from './User';

@Entity('Class', { schema: 'mydb' })
export class Class {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	Id: number;

	@Column('date', { name: 'StartDate' })
	StartDate: string;

	@Column('date', { name: 'EndDate' })
	EndDate: string;

	@Column('int', { name: 'MaxCapacity', nullable: true })
	MaxCapacity: number | null;

	@Column('varchar', { name: 'Period', nullable: true, length: 255 })
	Period: string | null;

	@Column('int', { name: 'CurrentIndex', nullable: true })
	CurrentIndex: number | null;

	@Column('tinyint', { name: 'IsActive', nullable: true, width: 1 })
	IsActive: boolean | null;

	@Column('tinyint', { name: 'IsDeleted', nullable: true, width: 1 })
	IsDeleted: boolean | null;

	@OneToMany(() => ClassOccurance, (ClassOccurance) => ClassOccurance.Class)
	ClassOccurances: ClassOccurance[];

	@ManyToMany(() => User, (User) => User.Classes)
	Users: User[];
}
