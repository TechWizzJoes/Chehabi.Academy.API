import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Course } from './Course';

@Index('RecordedSession_Course_FK', ['CourseId'], {})
@Entity('RecordedSession', { schema: 'mydb' })
export class RecordedSession {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((RecordedSession: RecordedSession) => RecordedSession.Course)
	@Column('int', { name: 'CourseId' })
	CourseId: number;

	@Column('varchar', { name: 'Link', nullable: true, length: 100 })
	Link: string | null;

	@ManyToOne(() => Course, (Course) => Course.RecordedSessions, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;
}
