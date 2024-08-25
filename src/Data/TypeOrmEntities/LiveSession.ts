import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';
import { User } from './User';

@Index('ClassOccurance_FK', ['ClassId'], {})
@Index('fk_LiveSession_created_by', ['CreatedBy'], {})
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

	@RelationId((LiveSession: LiveSession) => LiveSession.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@ManyToOne(() => Class, (Class) => Class.LiveSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;

	@ManyToOne(() => User, (User) => User.LiveSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;
}
