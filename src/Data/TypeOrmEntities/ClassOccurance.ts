import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Class } from './Class';

@Entity('ClassOccurance', { schema: 'mydb' })
export class ClassOccurance {
	@Column('int', { primary: true, name: 'ClassId' })
	ClassId: number;

	@Column('varchar', { primary: true, name: 'Occurance', length: 100 })
	Occurance: string;

	@ManyToOne(() => Class, (Class) => Class.ClassOccurances, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;

	@RelationId((ClassOccurance: ClassOccurance) => ClassOccurance.Class)
	ClassId2: number;
}
