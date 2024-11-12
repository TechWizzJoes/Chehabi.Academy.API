export namespace PaymentModels {
	export class MasterModel {
		Id: number;
		StripeSessionId: string;
		StripePaymentIntent: string;
		RefrenceNumber: string;
		Currency: string;
		TotalAmount: string;
		PaymentMethod: string;
		PaymentEmail: string;
		PaymentPhone: string | null;
		PaymentName: string;
	}
}
