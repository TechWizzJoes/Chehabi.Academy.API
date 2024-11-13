export namespace StripeModels {
	export class CheckoutProduct {
		price_data: price_data;
		quantity: number;

		constructor() {
			this.price_data = new price_data();
		}
	}
	class price_data {
		currency: string;
		unit_amount: number;
		product_data: product_data;

		constructor() {
			this.product_data = new product_data();
		}
	}
	export class product_data {
		name: string;
		description: string;
		metadata: meta_data;

		constructor() {
			this.metadata = new meta_data();
		}
	}

	class meta_data {
		ClassId: number;
		CourseId: number;
		UserId: number;
		CartItemId: number;
	}
}
