import { WSDataEntity } from '@utils/entity/WSDataEntity';
import {
	WSDataEvent,
	type WSMessage,
	type EventHandlers,
} from '@interfaces/utility/connection';

import type { CloseEvent, ErrorEvent, MessageEvent, WebSocket } from 'ws';
import type { IConnectionDataOuput } from '@interfaces/ios/ws/connectionData';

export class ListenCommunicator {
	private listeners: Map<number, WebSocket> = new Map();

	constructor() {}

	public addListener(ws: WebSocket, callbacks: Partial<EventHandlers> = {}) {
		const key = this.listeners.size;
		this.listeners.set(this.listeners.size, ws);

		const connectionData: IConnectionDataOuput = {
			eventName: WSDataEvent.CONNECTION,
			data: true,
		};

		ws.send(JSON.stringify(connectionData));
		// ws.on('message', async (message, isBinary) => {
		// 	const data = new WSDataEntity<any>(message, isBinary);
		// 	console.log(await data.json());
		// });
		ws.onerror = this.handleErrorEvent(key, callbacks.onerror);
		ws.onclose = this.handleCloseEvent(key, callbacks.onclose);
	}

	public broadcast<T extends WSMessage<any>>(payload: T) {
		this.listeners.forEach((ws) => ws.send(JSON.stringify(payload)));
	}

	private handleMessageEvent(callback?: EventHandlers['onmessage']) {
		return async (event: MessageEvent, isBinary: boolean) => {
			const dataEntity = new WSDataEntity(event.data, isBinary);
			const message = await dataEntity.string();

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
