import { Validator } from '@utils/validator';
import type {
	IIncubationFinishedEventInput,
	IIncubationFinishedEventOutput,
} from '@interfaces/ios/ws/incubationFinishedEvent';
import { WSDataEvent } from '@interfaces/utility/connection';

export class IncubationFinishedDataDto extends Validator<null> {
	constructor(input: IIncubationFinishedEventInput) {
		super(input.data);
	}

	public export(): IIncubationFinishedEventOutput {
		return {
			eventName: WSDataEvent.INCUBATION_FINISHED,
			data: null,
		};
	}
}
