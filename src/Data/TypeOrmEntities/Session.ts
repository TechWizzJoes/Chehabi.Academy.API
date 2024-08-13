import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Class } from './Class';

@Index('Session_FK', ['ClassId'], {})
@Entity('Session', { schema: 'mydb' })
export class Session {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((Session: Session) => Session.Class)
	@Column('int', { name: 'ClassId' })
	ClassId: number;

	@Column('datetime', { name: 'Date' })
	Date: Date;

	@ManyToOne(() => Class, (Class) => Class.Sessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;
}
