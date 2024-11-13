import { Injectable } from '@nestjs/common';

import { AppConfig, Config } from '@App/Config/App.Config';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { PaymentRepository } from './Payment.Repository';
import { PaymentModels } from './Payment.Models';
import { StripeService } from './stripe.service';
import { NotificationsService } from '../-Notifications/Notifications.Service';
import { UserService } from '../User/User.Service';
import { StripeModels } from './Stripe.Models';
import { CartModels } from '../Cart/Cart.Models';
import { NotificationModels } from '../-Notifications/Notifications.Models';
import { NotificationTemplateKey } from '../-Notifications/NotificationTemplateKey';
import { ClassService } from '../Class/Class.Service';
import { CartService } from '../Cart/Cart.Service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private PaymentRepository: PaymentRepository,
		private UserHelper: UserHelper,
		private CartService: CartService,
		private ClassService: ClassService,
		private StripeService: StripeService,
		private NotificationsService: NotificationsService,
		private UserService: UserService
	) {
		this.Config = this.appConfig.Config;
	}

	async GetByUserId(userId?: number): Promise<PaymentModels.MasterModel> {
		if (!userId) {
			const CurrentUser = this.UserHelper.GetCurrentUser();
			userId = CurrentUser.UserId;
		}

		return this.PaymentRepository.GetByUserId(userId);
	}

	async getSessionLink() {
		const cart = await this.CartService.GetByUserId();
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const checkouProducts = this.GetCheckoutProducts(cart, CurrentUser.UserId);
		return this.StripeService.getSessionLink(CurrentUser.UserId, checkouProducts);
	}

	GetCheckoutProducts(cart: CartModels.MasterModel, userId: number): StripeModels.CheckoutProduct[] {
		return cart.CartItems.map((item) => {
			let stripelineItem = new StripeModels.CheckoutProduct();
			stripelineItem.price_data.currency = cart.Currency;
			stripelineItem.price_data.unit_amount = item.Price * 100; // to convert to cents
			stripelineItem.quantity = item.Quantity;
			stripelineItem.price_data.product_data.metadata.UserId = userId;
			stripelineItem.price_data.product_data.metadata.CartItemId = item.Id;
			if (item.CourseId) {
				stripelineItem.price_data.product_data.name = item.Course.Name;
				stripelineItem.price_data.product_data.metadata.CourseId = item.Course.Id;
			}
			if (item.ClassId) {
				stripelineItem.price_data.product_data.name = item.Class.Name;
				stripelineItem.price_data.product_data.metadata.ClassId = item.Class.Id;
			}
			return stripelineItem;
		});
	}

	HandleStripeWebhook(payload: any, sig: any) {
		let event;
		event = this.StripeService.ConstructEvent(payload.toString(), sig);

		if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
			this.fulfillCheckout(event.data.object.id);
		}
	}

	async fulfillCheckout(sessionId: string) {
		let session = await this.StripeService.getSession(sessionId);
		const payment = await this.AuditPayment(session);
		let products = await this.StripeService.getSessionProducts(session);
		// console.log(products);
		if (products.length == 0) return;

		const userId = products[0].metadata.UserId;
		for (const product of products) {
			const classId = product.metadata.ClassId;
			const userClass = await this.ClassService.JoinClass(userId, classId);
			if (userClass) {
				this.CartService.RemoveFromCart(product.metadata.CartItemId, userId);
			}
		}
		this.NotifyUser(userId, payment);
	}

	async AuditPayment(session: Stripe.Response<Stripe.Checkout.Session>): Promise<PaymentModels.MasterModel> {
		let newPayment = {
			Id: 0,
			UserId: parseInt(session.metadata.UserId),
			StripeSessionId: session.payment_intent,
			StripePaymentIntent: session.payment_intent,
			RefrenceNumber: session.metadata.RefrenceNumber,
			Currency: session.currency,
			TotalAmount: session.amount_total.toString(),
			PaymentMethod: session.payment_method_types[0],
			PaymentEmail: session.customer_details.email,
			PaymentPhone: session.customer_details.phone,
			PaymentName: session.customer_details.name
		} as PaymentModels.MasterModel;

		return this.PaymentRepository.Create(newPayment);
	}

	async NotifyUser(userId: number, payment: PaymentModels.MasterModel) {
		const user = await this.UserService.GetById(userId);
		const payload = new NotificationModels.NotificationPayload();
		payload.Type = NotificationTemplateKey.PAYMENT_SUCCESS;
		payload.User = user;
		payload.Placeholders = {
			FirstName: user.FirstName,
			LastName: user.LastName,
			TotalAmount: payment.TotalAmount,
			RefrenceNumber: payment.RefrenceNumber,
			SiteUrl: 'www.google.com'
		};
		this.NotificationsService.NotifyUser(payload);

		// Todo
		if (payment.PaymentEmail != user.Email) {
		}
	}
}
