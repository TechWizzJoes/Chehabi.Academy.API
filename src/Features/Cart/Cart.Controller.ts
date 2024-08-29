import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { CartModels } from './Cart.Models';
import { CartService } from './Cart.Service';

@ApiTags('Cart')
@UseGuards(AuthenticatedGuard)
@Controller('cart')
export class CartController {
	constructor(private CartService: CartService) {}

	@Get('')
	GetOne(): Promise<CartModels.MasterModel> {
		return this.CartService.GetByUserId();
	}

	@Put('/add')
	@ApiBody({ type: CartModels.CartReqModel })
	AddToCart(@Body() cartItem: CartModels.CartItemReqModel): Promise<CartModels.MasterModel> {
		return this.CartService.AddToCart(cartItem);
	}

	@Put('/remove/:id')
	RemoveFromCart(@Param('id') itemId: number): Promise<CartModels.MasterModel> {
		return this.CartService.RemoveFromCart(itemId);
	}
}
