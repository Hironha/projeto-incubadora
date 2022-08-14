import type * as WebSocket from 'ws';

import { SenderCommunicator } from './SenderCommunicator';
import { ListenCommunicator } from './ListenCommunicator';
import { MonitoringEventHandler } from './MonitoringEventHandler';
import { InitIncubationEventHandler } from './InitIncubationEventHandler';

import { WSDataEvent, WSMessage } from '@interfaces/utility/connection';

import type { IMonitoringEventOutput } from '@interfaces/ios/ws/monitoringEvent';
import type { IInitIncubationEventOutput } from '@interfaces/ios/ws/initIncubationEvent';
export class CommunicateIncubatorService {
	constructor(
		private sender = new SenderCommunicator(),
		private listeners = new ListenCommunicator()
	) {}

	public addSender(ws: WebSocket, ttl?: number) {
		const monitoringEventHandler = new MonitoringEventHandler();

		const handleMessageEvent = async (message: WSMessage<any>) => {
			if (message.eventName === WSDataEvent.MONITORING) {
				const callback = (output: IMonitoringEventOutput) => this.listeners.broadcast(output);
				await monitoringEventHandler.exec(message, callback);
			}

			if (message.eventName === WSDataEvent.INCUBATION_INITIALIZED) {
				this.listeners.broadcast(message);
			}
		};

		this.sender.setSender(ws, { onmessage: handleMessageEvent });
	}

	public addListener(ws: WebSocket) {
		const initIncubationEventHandler = new InitIncubationEventHandler();

		const handleMessageEvent = async (message: WSMessage<any>) => {
			if (message.eventName === WSDataEvent.INIT_INCUBATION) {
				const callback = (output: IInitIncubationEventOutput) => this.sender.sendMessage(output);
				await initIncubationEventHandler.exec(message, callback);
			}
		};

		this.listeners.addListener(ws, { onmessage: handleMessageEvent });
	}
}
