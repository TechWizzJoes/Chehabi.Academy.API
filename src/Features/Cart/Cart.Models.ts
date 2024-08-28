import { LiveSessionModels } from '../Session/Session.Models';
import { UserModels } from '../User/User.Models';
import { CoursesModels } from '../Courses/Courses.Models';
import { ClassModels } from '../Class/Class.Models';

export namespace CartModels {
	export class MasterModel {
		Id: number;
		UserId: number;
		UpdatedAt: Date | null;
		Discount: number | null;
		Currency: string | null;
		PromoCode: string | null;
		User: UserModels.MasterModel;
		CartItems: CartItem[];
	}

	export class CartReqModel implements Partial<MasterModel> {}

	export class CartItem {
		Id: number;
		CartId: number;
		CourseId: number | null;
		ClassId: number | null;
		Cart: CartModels.MasterModel;
		Class: ClassModels.MasterModel;
		Course: CoursesModels.MasterModel;
	}
}
