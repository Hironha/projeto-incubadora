import { validateOrReject } from 'class-validator';

import type { ValidationError, ValidatorOptions } from 'class-validator';

export class Validator<T> {
	constructor(obj: Partial<T>) {
		Object.assign(this, obj);
	}

	public async validate(options?: ValidatorOptions) {
		try {
			await validateOrReject(this, options);
		} catch (err) {
			const errors = err as ValidationError[];
			const constraints = errors[0].constraints;

			if (constraints)
				throw new Error(Object.values(constraints).at(0) as string);
		}
	}
}
