import type { WSMessage } from '@interfaces/utility/connection';
import type { IMonitoringData } from '@interfaces/utility/monitoring';

export interface IMonitoringEventInput extends WSMessage<IMonitoringData> {}

export interface IMonitoringEventOutput
	extends WSMessage<IMonitoringData & { sensored_at: string }> {}
