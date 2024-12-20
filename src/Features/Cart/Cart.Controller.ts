import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { CartModels } from './Cart.Models';
import { CartService } from './Cart.Service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
	constructor(private CartService: CartService) {}

	@UseGuards(AuthenticatedGuard)
	@Get('')
	GetOne(): Promise<CartModels.MasterModel> {
		return this.CartService.GetByUserId();
	}

	@UseGuards(AuthenticatedGuard)
	@Put('/add')
	@ApiBody({ type: CartModels.CartReqModel })
	AddToCart(@Body() cartItem: CartModels.CartItemReqModel): Promise<CartModels.MasterModel> {
		return this.CartService.AddToCart(cartItem);
	}

	@UseGuards(AuthenticatedGuard)
	@Put('/remove/:id')
	RemoveFromCart(@Param('id') itemId: number, @Body() payload: any): Promise<CartModels.MasterModel> {
		return this.CartService.RemoveFromCart(itemId);
	}
}
