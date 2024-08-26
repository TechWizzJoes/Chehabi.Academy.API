import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';
import { Course } from './Course';

@Index('RecordedSession_Course_FK', ['CourseId'], {})
@Index('fk_RecordedSession_created_by', ['CreatedBy'], {})
@Entity('RecordedSession', { schema: 'mydb' })
export class RecordedSession {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((RecordedSession: RecordedSession) => RecordedSession.Course)
	@Column('int', { name: 'CourseId' })
	CourseId: number;

	@Column('varchar', { name: 'Link', nullable: true, length: 100 })
	Link: string | null;

	@RelationId((RecordedSession: RecordedSession) => RecordedSession.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@ManyToOne(() => User, (User) => User.RecordedSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;

	@ManyToOne(() => Course, (Course) => Course.RecordedSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;
}
