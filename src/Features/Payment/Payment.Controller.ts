import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '@App/Common/Auth/Authenticated.Guard';
import { PaymentModels } from './Payment.Models';
import { PaymentService } from './Payment.Service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
	constructor(private PaymentService: PaymentService) {}

	@UseGuards(AuthenticatedGuard)
	@Get('')
	GetByUserId(): Promise<PaymentModels.MasterModel[]> {
		return this.PaymentService.GetByUserId();
	}

	@UseGuards(AuthenticatedGuard)
	@Get('/checkout')
	getSessionLink() {
		return this.PaymentService.getSessionLink();
	}

	// stripe listen --forward-to localhost:3001/api/payment/webhook
	@Post('/webhook')
	StripeWebhook(@Req() request: any) {
		const rawBody = request['rawBody']; // Access raw body
		const sig = request.headers['stripe-signature'];
		this.PaymentService.HandleStripeWebhook(rawBody, sig);
	}
}
