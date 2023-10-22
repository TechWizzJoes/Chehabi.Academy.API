import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Course', { schema: 'mydb' })
export class Course {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	Id: number;

	@Column('varchar', { name: 'name', length: 255 })
	Name: string;

	@Column('text', { name: 'Description', nullable: true })
	Description: string | null;

	@Column('varchar', { name: 'VideoPath', nullable: true, length: 255 })
	VideoPath: string | null;

	@Column('varchar', { name: 'FilePath', nullable: true, length: 255 })
	FilePath: string | null;

	@Column('tinyint', { name: 'IsActive', nullable: true, width: 1 })
	IsActive: boolean | null;

	@Column('tinyint', { name: 'IsDeleted', nullable: true, width: 1 })
	IsDeleted: boolean | null;
}
