import { WSDataEntity } from '@utils/entity/WSDataEntity';
import { MonitoringEventHandler } from './MonitoringEventHandler';
import { IncubationInitializedEventHandler } from './IncubationInitializedEventHandler';

import type { WebSocket, ErrorEvent, CloseEvent, RawData } from 'ws';
import { WSDataEvent, type WSMessage } from '@interfaces/utility/connection';
import type { ListenCommunicator } from '../ListenCommunicator';
import type { IMonitoringEventOutput } from '@interfaces/ios/ws/monitoringEvent';
import type { IIncubationInitializedEventOutput } from '@interfaces/ios/ws/incubationInitializedEvent';

export class SenderCommunicator {
	private ttl: number = 30 * 1000;
	private sender: WebSocket | null = null;
	private timeout: NodeJS.Timeout | null = null;

	constructor(
		private monitoringEventHandler = new MonitoringEventHandler(),
		private incubationInitializedEventHandler = new IncubationInitializedEventHandler()
	) {}

	public setSender(ws: WebSocket, listeners: ListenCommunicator) {
		if (this.sender) this.sender.close(1000, 'substituido');
		this.sender = ws;

		console.log('Established connection with Sender');

		// ws.onopen = callbacks.onopen || null;
		ws.onerror = this.handleErrorEvent();
		ws.onclose = this.handleCloseEvent(listeners);
		ws.on('ping', this.handlePingEvent());
		ws.on('message', this.handleMessageEvent(listeners));
	}

	public sendMessage<T>(message: T) {
		console.log(`Sending message to Sender`, message);
		if (!this.sender) return;
		this.sender.send(JSON.stringify(message));
	}

	public close() {}

	private handleMessageEvent(listeners: ListenCommunicator) {
		return async (data: RawData, isBinary: boolean) => {
			const dataEntity = new WSDataEntity(data, isBinary);
			const message = await dataEntity.json<WSMessage<any>>();
			if (!message) return;

			if (message.eventName === WSDataEvent.MONITORING) {
				const callback = (output: IMonitoringEventOutput) => listeners.broadcast(output);
				await this.monitoringEventHandler.exec(message, callback);
			}

			if (message.eventName === WSDataEvent.INCUBATION_INITIALIZED) {
				console.log(message);
				const callback = (output: IIncubationInitializedEventOutput) => listeners.broadcast(output);
				await this.incubationInitializedEventHandler.exec(message, callback);
			}
		};
	}

	private handlePingEvent() {
		return async (buffer: Buffer) => {
			if (!this.sender) return;
			this.sender.pong();
			this.setSenderTimeout();
		};
	}

	private handleErrorEvent() {
		return async (event: ErrorEvent) => {
			if (!this.sender) return;
			this.sender.close(1000, 'error');
			this.sender = null;
			console.error(event);
		};
	}

	private handleCloseEvent(getListeners: ListenCommunicator) {
		return async (event: CloseEvent) => {
			this.sender = null;
		};
	}

	private setSenderTimeout() {
		if (this.timeout) clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			if (!this.sender) return;
			this.sender.close(1000);
			this.sender = null;
		}, this.ttl);
	}
}
