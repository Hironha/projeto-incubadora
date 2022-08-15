import { IsEnum } from 'class-validator';
import { Validator } from '@utils/validator';
import { IncubationStatus } from '@interfaces/models/incubation';

import type {
	IGetIncubationDataInput,
	IGetIncubationDataOutput,
} from '@interfaces/ios/getIncubationData';

export class GetIncubationDataDto
	extends Validator<IGetIncubationDataInput>
	implements IGetIncubationDataInput
{
	@IsEnum(IncubationStatus)
	status?: IncubationStatus | undefined;
	constructor(input: Partial<IGetIncubationDataInput>) {
		super(input);
	}

	public export(): IGetIncubationDataOutput {
		return {
			status: this.status || IncubationStatus.FINISHED,
		};
	}
}
