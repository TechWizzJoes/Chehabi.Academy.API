import { UserModels } from '../User/User.Models';

export namespace NotificationModels {
	export class NotificationTemplate {
		Id: number;
		Key: string | null;
		Type: string | null;
		Template: string | null;
		CreatedBy: number | null;
		Creator: UserModels.MasterModel;
	}

	export class NotificationSubscriptions {
		Id: number;
		UserId: number | null;
		Subscription: string;
		User: UserModels.MasterModel;
	}
}
