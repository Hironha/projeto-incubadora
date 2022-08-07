import type { WSDataEvent } from '@interfaces/utility/connection';
import type { ISensorData } from '@interfaces/models/sensorData';

export interface IMonitoringDataInput {
	eventName: WSDataEvent;
	data: Omit<ISensorData, 'sensored_at'> & {
		bulbStatus: 'on' | 'off';
	};
}

export interface IMonitoringDataOutput {
	eventName: WSDataEvent;
	data: ISensorData & {
		bulbStatus: 'on' | 'off';
	};
}
