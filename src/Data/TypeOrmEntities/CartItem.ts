import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { Cart } from './Cart';
import { Class } from './Class';
import { Course } from './Course';

@Index('CartItem_Course_FK', ['CourseId'], {})
@Index('CartItem_Class_FK', ['ClassId'], {})
@Index('CartItem_Cart_FK', ['CartId'], {})
@Entity('CartItem', { schema: 'mydb' })
export class CartItem {
	@PrimaryGeneratedColumn({ type: 'int', name: 'Id' })
	Id: number;

	@RelationId((CartItem: CartItem) => CartItem.Cart)
	@Column('int', { name: 'CartId' })
	CartId: number;

	@RelationId((CartItem: CartItem) => CartItem.Course)
	@Column('int', { name: 'CourseId', nullable: true })
	CourseId: number | null;

	@RelationId((CartItem: CartItem) => CartItem.Class)
	@Column('int', { name: 'ClassId', nullable: true })
	ClassId: number | null;

	@Column('int', { name: 'Quantity', nullable: true })
	Quantity: number | null;

	@Column('float', { name: 'Price', nullable: true, precision: 12 })
	Price: number | null;

	@Column('float', { name: 'SubTotal', nullable: true, precision: 12 })
	SubTotal: number | null;

	@ManyToOne(() => Cart, (Cart) => Cart.CartItems, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CartId', referencedColumnName: 'Id' }])
	Cart: Cart;

	@ManyToOne(() => Class, (Class) => Class.CartItems, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'ClassId', referencedColumnName: 'Id' }])
	Class: Class;

	@ManyToOne(() => Course, (Course) => Course.CartItems, {
		onDelete: 'NO ACTION',
		onUpdate: 'NO ACTION'
	})
	@JoinColumn([{ name: 'CourseId', referencedColumnName: 'Id' }])
	Course: Course;
}
