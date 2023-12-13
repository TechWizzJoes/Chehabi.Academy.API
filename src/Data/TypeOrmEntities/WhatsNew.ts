import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
