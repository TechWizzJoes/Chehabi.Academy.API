import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';

@Index('ClassOccurance_FK', ['ClassId'], {})
@Entity('LiveSession', { schema: 'mydb' })
export class LiveSession {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((LiveSession: LiveSession) => LiveSession.Class)
	@Column('int', { name: 'ClassId' })
	ClassId: number;

	@Column('datetime', { name: 'StartDate' })
	StartDate: Date;

	@Column('datetime', { name: 'EndDate' })
	EndDate: Date;

	@Column('varchar', { name: 'Link', nullable: true, length: 100 })
	Link: string | null;

	@ManyToOne(() => Class, (Class) => Class.LiveSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;
}
