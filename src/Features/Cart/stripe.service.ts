import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartModels } from './Cart.Models';
import { AppConfig } from '@App/Config/App.Config';
import { PaymentModels } from './Payment.Models';
import { v4 as uuidv4 } from 'uuid';
import { PaymentRepository } from './Payment.Repository';

@Injectable()
export class StripeService {
	stripe!: Stripe;
	currentCustomer!: Stripe.Customer | Stripe.DeletedCustomer;
	endpointSecret = this.AppConfig.Config.Stripe.EndpointSecret;
	constructor(private AppConfig: AppConfig, private PaymentRepository: PaymentRepository) {
		this.initStripe();
	}

	initStripe() {
		this.stripe = new Stripe(this.AppConfig.Config.Stripe.Secret);
	}

	async getSessionLink(products) {
		const session = await this.stripe.checkout.sessions.create({
			payment_method_types: ['card'], // List of accepted payment methods (e.g., 'card', 'ideal')
			// saved_payment_method_options: {
			//   allow_redisplay_filters: true,
			//   payment_method_save: true,
			// },
			line_items: products,
			mode: 'payment', // Set to 'subscription' for subscriptions
			custom_text: {
				// shipping_address: {
				//   message:
				//     "Please note that we can't guarantee 2-day delivery for PO boxes at this time.",
				// },
				// submit: {
				//   // text above submit button
				//   message: "We'll email you instructions on how to get started.",
				// },
				// after_submit: {
				//   // text below submit
				//   message:
				//     'Learn more about **your purchase** on our [product page](https://www.diwanstudios.com/).',
				// },
				// terms_of_service_acceptance: {
				//   message:
				//     'I agree to the [Terms of Service](https://example.com/terms)',
				// },
			},
			success_url: 'http://localhost:4200/success?session_id={CHECKOUT_SESSION_ID}', // Replace with your success URL
			cancel_url: 'http://localhost:4200/cart' // Replace with your cancel URL
			// consent_collection: {
			//   terms_of_service: 'required',
			// },
			// shipping_address_collection: {
			//   allowed_countries: ['US', 'EG'],
			// },
			// shipping_options: [
			//   {
			//     shipping_rate_data: {
			//       type: 'fixed_amount',
			//       fixed_amount: {
			//         amount: 10,
			//         currency: 'usd',
			//       },
			//       display_name: 'Next day air',
			//       delivery_estimate: {
			//         minimum: {
			//           unit: 'business_day',
			//           value: 1,
			//         },
			//         maximum: {
			//           unit: 'business_day',
			//           value: 1,
			//         },
			//       },
			//     },
			//   },
			// ],
			// phone_number_collection: {
			//   enabled: true,
			// },
		});

		return { url: session.url };
	}

	ConstructEvent(payload, sig) {
		try {
			let event = this.stripe.webhooks.constructEvent(payload, sig, this.endpointSecret);
			return event;
		} catch (err) {
			throw new ApplicationException(ErrorCodesEnum.STRIPE_WEBHOOK_ERROR, HttpStatus.BAD_REQUEST);
		}
	}

	async getSession(sessionId): Promise<Stripe.Response<Stripe.Checkout.Session>> {
		const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items']
		});
		return checkoutSession;
	}

	async AuditPayment(session: Stripe.Response<Stripe.Checkout.Session>): Promise<PaymentModels.MasterModel> {
		let newPayment = {
			Id: 0,
			StripeSessionId: session.payment_intent,
			StripePaymentIntent: session.payment_intent,
			RefrenceNumber: uuidv4(),
			Currency: session.currency,
			TotalAmount: session.amount_total.toString(),
			PaymentMethod: session.payment_method_types[0],
			PaymentEmail: session.customer_details.email,
			PaymentPhone: session.customer_details.phone,
			PaymentName: session.customer_details.name
		} as PaymentModels.MasterModel;

		return this.PaymentRepository.Create(newPayment);
	}

	async getSessionProducts(session: Stripe.Response<Stripe.Checkout.Session>): Promise<CartModels.StripeProduct[]> {
		let products: CartModels.StripeProduct[] = [];

		// Check the Checkout Session's payment_status property
		// to determine if fulfillment should be peformed
		if (session.payment_status !== 'unpaid') {
			for (const item of session.line_items.data) {
				const stripeProductId = item.price.product.toString();
				const product = (await this.stripe.products.retrieve(stripeProductId)) as any;
				products.push(product);
			}
		}
		return products;
	}
}
