import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
	// To db from typeorm
	to(value): any {
		return value;
	}
	// From db to typeorm
	from(value: number): boolean | null {
		return !!value;
	}
}
