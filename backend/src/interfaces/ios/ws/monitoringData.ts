import type { WSDataEvent, WSMessage } from '@interfaces/utility/connection';
import type { ISensorData } from '@interfaces/models/sensorData';

export interface IMonitoringDataInput
	extends WSMessage<
		Omit<ISensorData, 'sensored_at'> & {
			bulbStatus: 'on' | 'off';
		}
	> {}

export interface IMonitoringDataOutput
	extends WSMessage<
		ISensorData & {
			bulbStatus: 'on' | 'off';
		}
	> {}
