import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';
import { Validator } from '@utils/validator';
import { validationMessages as messages } from '@utils/validator/validations';

import type { IMonitoringData } from '@interfaces/utility/monitoring';

export class MonitoringDataDto
	extends Validator<IMonitoringData>
	implements IMonitoringData
{
	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	temperature: number;

	@IsNumber()
	@IsNotEmpty({ message: messages.isRequired })
	humidity: number;

	@IsIn(['on', 'off'])
	@IsNotEmpty({ message: messages.isRequired })
	bulbStatus: 'on' | 'off';

	constructor(input: Partial<IMonitoringData>) {
		super(input);
	}

	public export(): IMonitoringData {
		return {
			temperature: this.temperature,
			bulbStatus: this.bulbStatus,
			humidity: this.humidity,
		};
	}
}
