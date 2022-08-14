import { IsNotEmpty, IsNumber } from 'class-validator';
import { Validator } from '@utils/validator';
import { validationMessages as messages } from '@utils/validator/validations';
import { IsBiggerThan } from '@utils/validator/decorators/isBiggerThan';

import type { IIncubation } from '@interfaces/models/incubation';
import type { IInitIncubationEventOutput } from '@interfaces/ios/ws/initIncubationEvent';
import { WSDataEvent } from '@interfaces/utility/connection';

export class InitIncubationDto
	extends Validator<Omit<IIncubation, 'status'>>
	implements Omit<IIncubation, 'status'>
{
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

	constructor(input: Partial<Omit<IIncubation, 'status'>>) {
		super(input);
	}

	public export(): IInitIncubationEventOutput {
		return {
			eventName: WSDataEvent.INIT_INCUBATION,
			data: {
				roll_interval: this.roll_interval,
				incubation_duration: this.incubation_duration,
				min_temperature: this.min_temperature,
				max_temperature: this.max_temperature,
				started_at: this.started_at,
			},
		};
	}
}
