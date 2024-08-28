// CartRepository
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '@App/Data/TypeOrmEntities/Cart';
import { User } from '@App/Data/TypeOrmEntities/User';
import { CartModels } from './Cart.Models';
import { Course } from '@App/Data/TypeOrmEntities/Course';

@Injectable()
export class CartRepository {
	constructor(
		@InjectRepository(Cart)
		private classRepository: Repository<Cart>,
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async GetById(id: number): Promise<Cart> {
		return this.classRepository.findOne({
			relations: ['Users', 'Course', 'Course.Cartes', 'LiveSessions'],
			where: {
				Id: id
			}
		});
	}

	async Create(classData: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		const newCart = this.classRepository.create({
			...classData
		});
		return await this.classRepository.save(newCart);
	}

	async Update(id: number, classData: CartModels.CartReqModel): Promise<Cart> {
		let updateCart: Cart = await this.classRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!updateCart) {
			// handle case where the class is not found
			return null;
		}

		updateCart = {
			...updateCart,
			...classData
		};

		return await this.classRepository.save(updateCart);
	}

	async Delete(id: number): Promise<Cart> {
		let deleteCart: Cart = await this.classRepository.findOne({
			where: {
				Id: id
			}
		});
		if (!deleteCart) {
			// handle case where the class is not found
			return null;
		}

		return await this.classRepository.save(deleteCart);
	}
}
