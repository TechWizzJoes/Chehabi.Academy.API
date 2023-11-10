
export namespace CoursesModels {
	export class MasterModel {
		Id: number;
		Name: string;
		Description: string | null;
		VideoPath: string | null;
		FilePath: string | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
		Rating: number | null;
		ImageUrl: string | null;
		Instructor: string | null;
		Price: number | null;
		Raters: number | null;
	}

	export type EntityModel = Omit<MasterModel, ''>;
	// export type ListingResModel = Partial<Omit<MasterModel, 'Description' | 'Script'>>;
	// export type EditingResModel = Partial<MasterModel>;
	// export type LookupResModel = Pick<MasterModel, 'Id' | 'Title' | 'CreatedBy'>;
	// export type ReqModel = Pick<MasterModel, 'Title' | 'Description' | 'Script' | 'SharingOptionId'>;

	export class ReqModel implements Partial<MasterModel> {
		Name: string;
		Description: string | null;
		VideoPath: string | null;
		FilePath: string | null;
		IsActive: boolean | null;
		IsDeleted: boolean | null;
	}
}
