import { WSDataEntity } from '@utils/entity/WSDataEntity';
import { WSDataEvent, type WSMessage } from '@interfaces/utility/connection';
import { SenderCommunicator } from '../SenderCommunicator';
import { InitIncubationEventHandler } from './InitIncubationEventHandler';

import type { CloseEvent, ErrorEvent, RawData, WebSocket } from 'ws';
import type { IConnectionEventOutput } from '@interfaces/ios/ws/connectionEvent';

export class ListenCommunicator {
	private listeners: Map<number, WebSocket> = new Map();

	constructor(private initIncubationEventHandler = new InitIncubationEventHandler()) {}

	public addListener(ws: WebSocket, sender: SenderCommunicator) {
		const key = this.listeners.size;
		this.listeners.set(this.listeners.size, ws);
		this.notifyConnection(ws);
		console.log('Established connection with a Listener');
		ws.onerror = this.handleErrorEvent(key);
		ws.onclose = this.handleCloseEvent(key);
		ws.on('message', this.handleMessageEvent(key, sender));
	}

	public broadcast<T extends WSMessage<any>>(payload: T) {
		this.listeners.forEach((ws) => ws.send(JSON.stringify(payload)));
	}

	private notifyConnection(ws: WebSocket) {
		const connectionData: IConnectionEventOutput = {
			eventName: WSDataEvent.CONNECTION,
			data: true,
		};

		ws.send(JSON.stringify(connectionData));
	}

	private handleMessageEvent(key: number, sender: SenderCommunicator) {
		return async (data: RawData, isBinary: boolean) => {
			const ws = this.listeners.get(key);
			const dataEntity = new WSDataEntity(data, isBinary);
			const message = await dataEntity.json<WSMessage<any>>();
			if (!message || !ws) return;

			if (message.eventName === WSDataEvent.INIT_INCUBATION) {
				await this.initIncubationEventHandler.exec(message, ws, sender);
			}
		};
	}

	private handleErrorEvent(key: number) {
		return async (event: ErrorEvent) => {
			this.listeners.delete(key);
			console.error(event);
		};
	}

	private handleCloseEvent(key: number) {
		return async (event: CloseEvent) => {
			this.listeners.delete(key);
		};
	}
}
