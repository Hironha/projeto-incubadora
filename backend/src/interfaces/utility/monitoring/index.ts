import type { ISensorData } from '@interfaces/models/sensorData';

export interface IMonitoringData extends Omit<ISensorData, 'sensored_at'> {
	bulbStatus: 'on' | 'off';
}
