export const CommonHelper = {
	Now: () => {
		const now = new Date();
		// console.log(now);
		// const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000);
		// console.log(utcNow);
		// return utcNow;
		return now;
	},

	GetArraysDiff: (arr1: any[], arr2: any[]) => {
		let diff = arr1.filter((x) => !arr2.includes(x));
		return diff;
	},

	GetArraysIntersection: (arr1: any[], arr2: any[]) => {
		const intersection = arr1.filter((x) => arr2.includes(x));
		return intersection;
	}
};
