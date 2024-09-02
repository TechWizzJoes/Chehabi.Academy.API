import { ErrorCodesEnum } from '@App/Common/Enums/ErrorCodes.Enum';
import { ApplicationException } from '@App/Common/Exceptions/Application.Exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartModels } from './Cart.Models';

@Injectable()
export class StripeService {
	stripe!: Stripe;
	currentCustomer!: Stripe.Customer | Stripe.DeletedCustomer;
	endpointSecret = 'whsec_d76eb9c8a15754a5897624b4d9f20eb9d66dda408654f6da49b8f740db2398c5';
	constructor() {
		this.initStripe();
	}
	// test cards
	// https://docs.stripe.com/testing#cards
	// https://www.memberstack.com/blog/stripe-test-cards

	// // 4242 4242 4242 4242  success
	// // 4000 0000 0000 9995  failure
	initStripe() {
		this.stripe = new Stripe(
			'sk_test_51PWE3b07M0CitDXtuZA4W4UmhrdfLPncjGuC0UTMUmm6thvsbyahPwqPHlDdoDJIWEFEl04znvAal96hXyJC5VyX00mHUUN47e'
		);
	}

	async getSessionLink(products) {
		// manage expired inventory
		// https://docs.stripe.com/payments/checkout/managing-limited-inventory

		// discounts
		// https://docs.stripe.com/payments/checkout/discounts

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

	async getSessionProducts(sessionId) {
		// Retrieve the Checkout Session from the API with line_items expanded
		const checkoutSession = await this.stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['line_items']
		});

		let products: CartModels.StripeProduct[] = [];

		// Check the Checkout Session's payment_status property
		// to determine if fulfillment should be peformed
		if (checkoutSession.payment_status !== 'unpaid') {
			// console.log(checkoutSession.line_items.data);
			for (const item of checkoutSession.line_items.data) {
				const stripeProductId = item.price.product.toString();
				const product = (await this.stripe.products.retrieve(stripeProductId)) as any;
				products.push(product);
			}
		}
		return products;
	}
}
