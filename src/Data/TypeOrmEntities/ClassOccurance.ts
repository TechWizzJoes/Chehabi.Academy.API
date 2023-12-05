import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';

@Index('ClassOccurance_FK', ['ClassId'], {})
@Entity('ClassOccurance', { schema: 'mydb' })
export class ClassOccurance {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('int', { name: 'ClassId' })
	@RelationId((ClassOccurance: ClassOccurance) => ClassOccurance.Class)
	ClassId: number;

	@Column('varchar', { name: 'Occurance', length: 100 })
	Occurance: string;

	@ManyToOne(() => Class, (Class) => Class.ClassOccurances, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;
}
