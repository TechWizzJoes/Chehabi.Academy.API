export class Constants {
	public static DatetodbFormat(date: Date): string {
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		const seconds = String(date.getUTCSeconds()).padStart(2, '0');

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	public static Now(): Date {
		return new Date();
	}

	public static GetYear() {
		return new Date().getFullYear().toString();
	}

	public static CapitalizeFirstLetter(name: string): string {
		if (!name) return '';
		return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
	}

	public static convertLocalToUTC(localDateTimeStr, timeZone) {
		const [datePart, timePart] = localDateTimeStr.split("T");
		const [year, month, day] = datePart.split("-").map(Number);
		const [hour, minute, second] = timePart.split(":").map(Number);

		// Create a UTC date that corresponds to that local time in the target zone
		const asUTC = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

		// Step 4: Shift by the difference between the "intended zone" and UTC
		const fmt = new Intl.DateTimeFormat("en-US", {
			timeZone,
			hour12: false,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		// Format that UTC anchor as if it were in the target zone
		const zoned = fmt.formatToParts(asUTC);

		const zonedHour = parseInt(zoned.find(p => p.type === "hour").value, 10);
		const diffHours = hour - zonedHour;

		// Adjust by that diff
		asUTC.setUTCHours(asUTC.getUTCHours() + diffHours);

		return asUTC;
	}
}
