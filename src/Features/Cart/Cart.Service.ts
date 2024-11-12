import { Injectable } from '@nestjs/common';

import { AppConfig, Config } from '@App/Config/App.Config';
import { UserHelper } from '@App/Common/Helpers/CurrentUser.Helper';
import { CartRepository } from './Cart.Repository';
import { CartModels } from './Cart.Models';
import { UserModels } from '../User/User.Models';
import { OnEvent } from '@nestjs/event-emitter';
import { Events } from '@App/Common/Events/Events';
import { ClassService } from '../Class/Class.Service';
import { CoursesService } from '../Courses/Courses.Service';
import { Constants } from '@App/Common/Constants';
import { StripeService } from './stripe.service';
import { StripeModels } from './Stripe.Models';
import { NotificationsService } from '../-Notifications/Notifications.Service';
import { NotificationModels } from '../-Notifications/Notifications.Models';
import { NotificationTemplateKey } from '../-Notifications/NotificationTemplateKey';
import { UserService } from '../User/User.Service';
import { PaymentModels } from './Payment.Models';

@Injectable()
export class CartService {
	Config: Config;

	constructor(
		private appConfig: AppConfig,
		private CartRepository: CartRepository,
		private UserHelper: UserHelper,
		private ClassService: ClassService,
		private CoursesService: CoursesService,
		private StripeService: StripeService,
		private NotificationsService: NotificationsService,
		private UserService: UserService
	) {
		this.Config = this.appConfig.Config;
	}

	@OnEvent(Events.USER_CREATED)
	handleEvent(user: UserModels.MasterModel) {
		this.Create(user.Id);
	}

	async GetByUserId(userId?: number): Promise<CartModels.MasterModel> {
		if (!userId) {
			const CurrentUser = this.UserHelper.GetCurrentUser();
			userId = CurrentUser.UserId;
		}

		return this.CartRepository.GetByUserId(userId);
	}

	async Create(userId: number): Promise<CartModels.MasterModel> {
		const cartReq: CartModels.CartReqModel = new CartModels.CartReqModel();
		cartReq.UserId = userId;
		cartReq.Currency = 'usd';
		let createdCart = await this.CartRepository.Create(cartReq);
		return createdCart;
	}

	async AddToCart(cartItemReqModel: CartModels.CartItemReqModel): Promise<CartModels.MasterModel> {
		const CurrentUser = this.UserHelper.GetCurrentUser();
		if (cartItemReqModel.ClassId) {
			await this.ClassService.ValidateUserJoiningClass(CurrentUser.UserId, cartItemReqModel.ClassId);
		}

		let cart: CartModels.MasterModel = await this.GetByUserId();
		const existingItemIndex = cart.CartItems.findIndex(
			(item) =>
				(item.ClassId && item.ClassId == cartItemReqModel.ClassId) ||
				(item.CourseId && item.CourseId == cartItemReqModel.CourseId)
		);

		let newItem = new CartModels.CartItem();
		if (existingItemIndex !== -1) {
			const currentCartItem = cart.CartItems[existingItemIndex];
			currentCartItem.Quantity!++;
			currentCartItem.SubTotal = currentCartItem.Price * currentCartItem.Quantity;
			newItem.Price = currentCartItem.Price;
			await this.CartRepository.UpdateItem(currentCartItem);
		} else {
			if (cartItemReqModel.CourseId) {
				const selectedCourse = await this.CoursesService.GetById(cartItemReqModel.CourseId);
				newItem = {
					...newItem,
					...cartItemReqModel,
					CartId: cart.Id,
					CourseId: selectedCourse.Id,
					Price: selectedCourse.Price,
					Quantity: 1,
					SubTotal: selectedCourse.Price
				};
			}
			if (cartItemReqModel.ClassId) {
				const selectedclass = await this.ClassService.GetById(cartItemReqModel.ClassId);
				newItem = {
					...newItem,
					...cartItemReqModel,
					CartId: cart.Id,
					ClassId: selectedclass.Id,
					Price: selectedclass.Course.Price,
					Quantity: 1,
					SubTotal: selectedclass.Course.Price
				};
			}
			await this.CartRepository.AddItem(newItem);
		}

		cart.Total = (cart.Total ?? 0) + newItem.Price;
		cart.UpdatedAt = Constants.Now();
		await this.CartRepository.Update(cart.Id, cart);
		return this.GetByUserId();
	}

	async RemoveFromCart(itemId: number, userId?: number): Promise<CartModels.MasterModel> {
		let cart: CartModels.MasterModel = await this.GetByUserId(userId);
		const existingItemIndex = cart.CartItems.findIndex((item) => item.Id == itemId);

		if (existingItemIndex !== -1) {
			const currentCartItem = cart.CartItems[existingItemIndex];

			await this.CartRepository.DeleteItem(currentCartItem);

			cart.Total = (cart.Total ?? 0) - currentCartItem.SubTotal;
			cart.UpdatedAt = Constants.Now();
			await this.CartRepository.Update(cart.Id, cart);
			return this.GetByUserId();
		}
		return cart;
	}

	async getSessionLink() {
		const cart = await this.GetByUserId();
		const CurrentUser = this.UserHelper.GetCurrentUser();
		const checkouProducts = this.GetCheckoutProducts(cart, CurrentUser.UserId);
		return this.StripeService.getSessionLink(checkouProducts);
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
		const payment = await this.StripeService.AuditPayment(session);
		let products = await this.StripeService.getSessionProducts(session);
		// console.log(products);
		if (products.length == 0) return;

		const userId = products[0].metadata.UserId;
		for (const product of products) {
			const classId = product.metadata.ClassId;
			const userClass = await this.ClassService.JoinClass(userId, classId);
			if (userClass) {
				this.RemoveFromCart(product.metadata.CartItemId, userId);
			}
		}
		this.NotifyUser(userId, payment);
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
	}
}
