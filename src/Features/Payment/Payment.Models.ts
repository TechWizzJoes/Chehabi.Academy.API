import { ClassModels } from '../Class/Class.Models';
import { UserModels } from '../User/User.Models';

export namespace PaymentModels {
	export class MasterModel {
		Id: number;
		StripeSessionId: string;
		StripePaymentIntent: string;
		UserId: number;
		RefrenceNumber: string;
		Currency: string;
		TotalAmount: string;
		PaymentMethod: string;
		PaymentEmail: string;
		PaymentPhone: string | null;
		PaymentName: string;
		CreatedOn: Date | null;
		PaymentSessionId: number;

		User: UserModels.MasterModel | null;
		PaymentSession: PaymentSession;
		PaymentProducts: PaymentProduct[];
	}

	export class PaymentSession {
		Id: number;
		SessionObject: string;

		Payment: MasterModel;
	}

	export class PaymentProduct {
		PaymentId: number;
		ClassId: number;
		CreatedOn: Date | null;
		Payment: MasterModel;
		Class: ClassModels.MasterModel;
	}
}
