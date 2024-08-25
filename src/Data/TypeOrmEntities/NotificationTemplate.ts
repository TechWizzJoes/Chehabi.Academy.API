import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('fk_NotificationTemplate_created_by', ['CreatedBy'], {})
@Entity('NotificationTemplate', { schema: 'mydb' })
export class NotificationTemplate {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'Key', nullable: true, length: 100 })
	Key: string | null;

	@Column('varchar', { name: 'Type', nullable: true, length: 100 })
	Type: string | null;

	@Column('varchar', { name: 'Template', nullable: true, length: 300 })
	Template: string | null;

	@RelationId((NotificationTemplate: NotificationTemplate) => NotificationTemplate.Creator)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@ManyToOne(() => User, (User) => User.NotificationTemplates, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	Creator: User;
}
