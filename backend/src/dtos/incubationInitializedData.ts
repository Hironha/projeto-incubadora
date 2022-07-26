import { IsEnum, IsNotEmpty, IsNumber, IsRFC3339 } from 'class-validator';
import { Validator } from '@utils/validator';
import { validationMessages as messages } from '@utils/validator/validations';
import { IsBiggerThan } from '@utils/validator/decorators/isBiggerThan';

import { IIncubation, IncubationStatus } from '@interfaces/models/incubation';
import type { IIncubationInitializedEventOutput } from '@interfaces/ios/ws/incubationInitializedEvent';
import { WSDataEvent } from '@interfaces/utility/connection';

export class IncubationInitializedDto extends Validator<IIncubation> implements IIncubation {
	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	roll_interval: number;

	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	incubation_duration: number;

	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	min_temperature: number;

	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	@IsBiggerThan('min_temperature', {
		message: 'Maximum temperature must be bigger than minimum temperature',
	})
	max_temperature: number;

	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	started_at: number;

	@IsEnum(IncubationStatus)
	@IsNotEmpty({ message: messages.isRequired })
	status: IncubationStatus;

	constructor(input: Partial<IIncubation>) {
		super(input);
	}

	public export(): IIncubationInitializedEventOutput {
		return {
			eventName: WSDataEvent.INCUBATION_INITIALIZED,
			data: {
				roll_interval: this.roll_interval,
				incubation_duration: this.incubation_duration,
				min_temperature: this.min_temperature,
				max_temperature: this.max_temperature,
				started_at: this.started_at,
				status: this.status,
			},
		};
	}
}
