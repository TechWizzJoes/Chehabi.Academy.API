import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppConfig, Config } from '@App/Config/App.Config';
import { CryptoHelper } from '@App/Common/Helpers/Crypto.Helper';
import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { CartRepository } from './Cart.Repository';
import { CartModels } from './Cart.Models';
import { promises } from 'dns';
import { UserService } from '../User/User.Service';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { CoursesService } from '../Courses/Courses.Service';
import { SessionService } from '../Session/Session.Service';
import { LiveSessionModels } from '../Session/Session.Models';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';

@Injectable()
export class CartService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private CartRepository: CartRepository,
		private UserService: UserService,
		private CoursesService: CoursesService,
		private SessionService: SessionService,
		private JwtService: JwtService,
		private UserHelper: UserHelper
	) {
		this.Config = this.appConfig.Config;
	}

	async GetById(id: number): Promise<CartModels.MasterModel> {
		return this.CartRepository.GetById(id);
	}

	async Create(newCart: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		let createdCart = await this.CartRepository.Update(1, newCart);
		return createdCart;
	}

	async Update(id, newCart: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		let updatedCart = await this.CartRepository.Update(id, newCart);
		return updatedCart;
	}

	async Delete(id): Promise<CartModels.MasterModel> {
		return await this.CartRepository.Delete(id);
	}
}
