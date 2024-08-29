import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { User } from './User';
import { CartItem } from './CartItem';

@Index('Cart_User_FK', ['UserId'], {})
@Entity('Cart', { schema: 'mydb' })
export class Cart {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((Cart: Cart) => Cart.User)
	@Column('int', { name: 'UserId' })
	UserId: number;

	@Column('datetime', {
		name: 'UpdatedAt',
		nullable: true,
		default: () => 'CURRENT_TIMESTAMP'
	})
	UpdatedAt: Date | null;

	@Column('int', { name: 'Discount', nullable: true })
	Discount: number | null;

	@Column('varchar', { name: 'Currency', nullable: true, length: 100 })
	Currency: string | null;

	@Column('varchar', { name: 'PromoCode', nullable: true, length: 100 })
	PromoCode: string | null;

	@Column('float', { name: 'Total', nullable: true, precision: 12 })
	Total: number | null;

	@ManyToOne(() => User, (User) => User.Carts, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'UserId', referencedColumnName: 'Id' }])
	User: User;

	@OneToMany(() => CartItem, (CartItem) => CartItem.Cart)
	CartItems: CartItem[];
}
