import type * as WebSocket from 'ws';

import { SenderCommunicator } from './SenderCommunicator';
import { ListenCommunicator } from './ListenCommunicator';
import { MonitoringEventHandler } from './MonitoringEventHandler';

import { WSDataEvent, WSMessage } from '@interfaces/utility/connection';

import type { IMonitoringEventOutput } from '@interfaces/ios/ws/monitoringEvent';
export class CommunicateIncubatorService {
	constructor(
		private sender = new SenderCommunicator(),
		private listeners = new ListenCommunicator()
	) {}

	public addSender(ws: WebSocket, ttl?: number) {
		const monitoringEventHandler = new MonitoringEventHandler();

		const handleMessageEvent = async (message: WSMessage<any>) => {
			if (message.eventName === WSDataEvent.MONITORING) {
				const callback = (output: IMonitoringEventOutput) => this.broadcast(output);
				await monitoringEventHandler.exec(message, callback);
			}
		};

		this.sender.setSender(ws, { onmessage: handleMessageEvent });
	}

	public addListener(ws: WebSocket) {
		const handleMessageEvent = async (message: WSMessage<any>) => {
			console.log(message);
			if (message.eventName === WSDataEvent.INIT_INCUBATION) {
			}
		};

		this.listeners.addListener(ws, { onmessage: handleMessageEvent });
	}

	private async broadcast(output: IMonitoringEventOutput) {
		this.listeners.broadcast(output);
	}
}
