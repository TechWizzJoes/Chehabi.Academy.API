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

		User: UserModels.MasterModel | null;
	}
}
