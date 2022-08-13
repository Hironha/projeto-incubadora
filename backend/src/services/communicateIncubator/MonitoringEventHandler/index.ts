import { MonitoringDataDto } from '@dtos/monitoringData';

import { Left, Right, type Either } from '@utils/management';

import type { IMonitoringData } from '@interfaces/utility/monitoring';
import type {
	IMonitoringEventInput,
	IMonitoringEventOutput,
} from '@interfaces/ios/ws/monitoringData';
import { WSDataEvent } from '@interfaces/utility/connection';

export class MonitoringEventHandler {
	private monitoringDataDto: MonitoringDataDto;

	constructor(event: IMonitoringEventInput) {
		this.monitoringDataDto = new MonitoringDataDto(event.data);
	}

	public async exec(
		callback: (data: IMonitoringEventOutput) => void | Promise<void>
	) {
		const getMonitoringDataFlow = await this.getMonitoringData();
		if (getMonitoringDataFlow.isLeft()) return getMonitoringDataFlow.export();

		await callback(this.getOutput(getMonitoringDataFlow.export()));
	}

	public async getMonitoringData(): Promise<Either<null, IMonitoringData>> {
		try {
			await this.monitoringDataDto.validate();
			return new Right(this.monitoringDataDto.export());
		} catch (err) {
			const message = (err as Error).message;
			console.error(message);
			return new Left(null);
		}
	}

	public getOutput(monitoringData: IMonitoringData): IMonitoringEventOutput {
		return {
			eventName: WSDataEvent.MONITORING,
			data: {
				...monitoringData,
				sensored_at: new Date().toUTCString(),
			},
		};
	}
}
