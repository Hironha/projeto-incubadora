import { IncubatorRepository } from '@repositories/incubator';

import type { ISensorData } from '@interfaces/models/sensorData';

export class SensoredDataStore {
	private maxSensoredData = 10;
	private sensoredData: ISensorData[] = [];

	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public async add(sensoredData: ISensorData) {
		this.sensoredData.push(sensoredData);

		if (this.sensoredData.length === this.maxSensoredData) {
			await this.store();
		}
	}

	private async store() {
		const saveSensorDataFlow = await this.incubatorRepository.saveSensorData(
			this.getMeanSensoredData()
		);

		if (saveSensorDataFlow.isLeft()) console.error(saveSensorDataFlow.export());

		if (saveSensorDataFlow.isRight()) {
			this.sensoredData = [];
		}
	}

	private getMeanSensoredData(): ISensorData {
		const accSensoredData = this.sensoredData.reduce(
			(acc, cur) => {
				acc.humidity += cur.humidity / this.sensoredData.length;
				acc.temperature += cur.temperature / this.sensoredData.length;
				return acc;
			},
			{ humidity: 0, temperature: 0 } as Omit<ISensorData, 'sensored_at'>
		);

		return {
			humidity: Math.round(100 * accSensoredData.humidity) / 100,
			temperature: Math.round(100 * accSensoredData.temperature) / 100,
			sensored_at: new Date().toUTCString(),
		};
	}
}
