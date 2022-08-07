import type { ISensorData } from '@interfaces/models/sensorData';

export interface IMonitoringDataInput extends Omit<ISensorData, 'sensored_at'> {
	bulbStatus: 'on' | 'off';
}

export interface IMonitoringDataOutput extends ISensorData {
	bulbStatus: 'on' | 'off';
}
