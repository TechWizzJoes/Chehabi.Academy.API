export class Constants {
	public static DTMF = [
		'9901',
		'9902',
		'9903',
		'9904',
		'9905',
		'9906',
		'9907',
		'9908',
		'9909',
		'9910',
		'9911',
		'9912',
		'9913',
		'9914',
		'9915',
		'9916',
		'9917',
		'9918',
		'9919',
		'9920'
	];
	public static MAX_DTMF = this.DTMF.length;

	public static DatetodbFormat(date: Date): string {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		const seconds = String(date.getUTCSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
}
