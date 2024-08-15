import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';

@Index('User_FK', ['CreatedBy'], {})
@Entity('WhatsNew', { schema: 'mydb' })
export class WhatsNew {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'Title', nullable: true, length: 100 })
	Title: string | null;

	@Column('text', { name: 'Text', nullable: true })
	Text: string | null;

	@Column('varchar', { name: 'PicturePath', nullable: true, length: 100 })
	PicturePath: string | null;

	@Column('bit', { name: 'IsActive', nullable: true, default: () => "'b'1''" })
	IsActive: boolean | null;

	@Column('bit', { name: 'IsDeleted', nullable: true, default: () => "'b'0''" })
	IsDeleted: boolean | null;

	@RelationId((WhatsNew: WhatsNew) => WhatsNew.User)
	@Column('int', { name: 'CreatedBy', nullable: true })
	CreatedBy: number | null;

	@Column('datetime', {
		name: 'CreatedOn',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	CreatedOn: Date | null;

	@Column('datetime', { name: 'UpdatedOn', nullable: true })
	UpdatedOn: Date | null;

	@ManyToOne(() => User, (User) => User.WhatsNews, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CreatedBy', referencedColumnName: 'Id' }])
	User: User;
}
