import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
