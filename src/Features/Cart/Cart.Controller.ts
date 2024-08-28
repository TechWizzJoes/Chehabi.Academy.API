import { Body, Controller, Get, Param, Post, Req, UseGuards, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { CartModels } from './Cart.Models';
import { CartService } from './Cart.Service';

@ApiTags('Cart')
// @UseGuards(AuthenticatedGuard)
@Controller('Cart')
export class CartController {
	constructor(private CartService: CartService) {}

	@Get('/:id')
	GetOne(@Param('id', ParseIntPipe) id: number): Promise<CartModels.MasterModel> {
		return this.CartService.GetById(id);
	}

	@Post('')
	@ApiBody({ type: CartModels.CartReqModel })
	Create(@Body() course: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		return this.CartService.Create(course);
	}

	@Put('/:id')
	@ApiBody({ type: CartModels.CartReqModel })
	Update(@Param('id') id: number, @Body() course: CartModels.CartReqModel): Promise<CartModels.MasterModel> {
		return this.CartService.Update(id, course);
	}

	@Delete('/:id')
	Delete(@Param('id') id: number): Promise<CartModels.MasterModel> {
		return this.CartService.Delete(id);
	}
}
