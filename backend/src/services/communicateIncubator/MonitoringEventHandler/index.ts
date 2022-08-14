import { MonitoringDataDto } from '@dtos/monitoringData';

import { Left, Right, type Either } from '@utils/management';
import { SensoredDataStore } from './SensoredDataStore';

import type { IMonitoringData } from '@interfaces/utility/monitoring';
import type {
	IMonitoringEventInput,
	IMonitoringEventOutput,
} from '@interfaces/ios/ws/monitoringEvent';
import { WSDataEvent } from '@interfaces/utility/connection';

export class MonitoringEventHandler {
	constructor(private sendoredDataStore = new SensoredDataStore()) {}

	public async exec(
		event: IMonitoringEventInput,
		callback: (data: IMonitoringEventOutput) => void | Promise<void>
	) {
		const dto = new MonitoringDataDto(event.data);
		const getMonitoringDataFlow = await this.getMonitoringData(dto);
		if (getMonitoringDataFlow.isLeft()) return getMonitoringDataFlow.export();

		const monitoringData = getMonitoringDataFlow.export();

		// await this.sendoredDataStore.add({
		// 	humidity: monitoringData.humidity,
		// 	temperature: monitoringData.temperature,
		// 	sensored_at: new Date().toUTCString(),
		// });

		await callback(this.getOutput(monitoringData));
	}

	public async getMonitoringData(
		dto: MonitoringDataDto
	): Promise<Either<null, IMonitoringData>> {
		try {
			await dto.validate();
			return new Right(dto.export());
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
