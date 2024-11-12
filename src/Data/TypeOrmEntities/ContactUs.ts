import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ContactUs', { schema: 'mydb' })
export class ContactUs {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@Column('varchar', { name: 'Email', length: 100 })
	Email: string;

	@Column('varchar', { name: 'FirstName', length: 100 })
	FirstName: string;

	@Column('varchar', { name: 'LastName', length: 100 })
	LastName: string;

	@Column('text', { name: 'Description' })
	Description: string;

	@Column('tinyint', {
		name: 'IsSentToUs',
		nullable: true,
		width: 1,
		default: () => "'0'"
	})
	IsSentToUs: boolean | null;

	@Column('tinyint', {
		name: 'IsSentToUser',
		nullable: true,
		width: 1,
		default: () => "'0'"
	})
	IsSentToUser: boolean | null;
}
