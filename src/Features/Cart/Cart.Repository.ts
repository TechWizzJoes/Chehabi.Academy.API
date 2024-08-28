import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@App/Data/TypeOrmEntities/Cart';
import { CartModels } from './Cart.Models';
import { CartItem } from '@App/Data/TypeOrmEntities/CartItem';

@Injectable()
export class CartRepository {
	constructor(
		@InjectRepository(Cart)
		private cartRepository: Repository<Cart>,
		@InjectRepository(CartItem)
		private cartItemRepository: Repository<CartItem>
	) {}

	async GetByUserId(userId: number): Promise<Cart> {
		return this.cartRepository.findOne({
			relations: ['CartItems.Class', 'CartItems.Course'],
			where: {
				UserId: userId
			}
		});
	}

	async Create(classData: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		const newCart = this.cartRepository.create({
			...classData
		});
		return await this.cartRepository.save(newCart);
	}

	async Update(id: number, cartData: CartModels.CartReqModel): Promise<Cart> {
		let updateCart: Cart = await this.cartRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateCart) {
			return null;
		}

		updateCart = {
			...updateCart,
			...cartData
		};

		delete updateCart.CartItems;
		return await this.cartRepository.save(updateCart);
	}

	async AddItem(cartItem: CartModels.CartItem): Promise<CartItem> {
		return await this.cartItemRepository.save(cartItem);
	}

	async UpdateItem(cartItem: CartModels.CartItem): Promise<CartItem> {
		return await this.cartItemRepository.save(cartItem);
	}

	async DeleteItem(cartItem: CartModels.CartItem): Promise<boolean> {
		const result = await this.cartItemRepository.delete({
			Id: cartItem.Id
		});
		return result.affected > 0;
	}
}
