import { WSDataEntity } from '@utils/entity/WSDataEntity';
import { WSDataEvent, type WSMessage, type EventHandlers } from '@interfaces/utility/connection';

import type { CloseEvent, ErrorEvent, RawData, WebSocket } from 'ws';
import type { IConnectionEventOutput } from '@interfaces/ios/ws/connectionEvent';

export class ListenCommunicator {
	private listeners: Map<number, WebSocket> = new Map();

	constructor() {}

	public addListener(ws: WebSocket, callbacks: Partial<EventHandlers> = {}) {
		const key = this.listeners.size;
		this.listeners.set(this.listeners.size, ws);
		this.notifyConnection(ws);
		ws.onerror = this.handleErrorEvent(key, callbacks.onerror);
		ws.onclose = this.handleCloseEvent(key, callbacks.onclose);
		ws.on('message', this.handleMessageEvent(callbacks.onmessage));
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

	private handleMessageEvent(callback?: EventHandlers['onmessage']) {
		return async (data: RawData, isBinary: boolean) => {
			const dataEntity = new WSDataEntity(data, isBinary);
			const message = await dataEntity.json<WSMessage<any>>();

			if (message && callback) await callback(message);
		};
	}

	private handleErrorEvent(key: number, callback?: EventHandlers['onerror']) {
		return async (event: ErrorEvent) => {
			callback && (await callback(event));
			this.listeners.delete(key);
			console.error(event);
		};
	}

	private handleCloseEvent(key: number, callback?: EventHandlers['onclose']) {
		return async (event: CloseEvent) => {
			callback && (await callback(event));
			this.listeners.delete(key);
			console.log(event.reason);
		};
	}
}
