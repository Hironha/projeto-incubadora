import { WSDataEntity } from '@utils/entity/WSDataEntity';
import type { WebSocket, ErrorEvent, CloseEvent, MessageEvent, RawData } from 'ws';
import type { EventHandlers, WSMessage } from '@interfaces/utility/connection';

export class SenderCommunicator {
	private ttl: number = 30 * 1000;
	private sender: WebSocket | null = null;
	private timeout: NodeJS.Timeout | null = null;

	constructor() {}

	public setSender(ws: WebSocket, callbacks: Partial<EventHandlers> = {}) {
		if (this.sender) this.sender.close(1000, 'substituido');
		this.sender = ws;

		ws.onopen = callbacks.onopen || null;
		ws.onclose = this.handleCloseEvent(callbacks.onclose);
		ws.onerror = this.handleErrorEvent(callbacks.onerror);
		ws.on('message', this.handleMessageEvent(callbacks.onmessage));
		ws.on('ping', this.handlePingEvent(callbacks.onping));
	}

	public sendMessage<T>(message: T) {
		if (!this.sender) return;
		this.sender.send(JSON.stringify(message));
	}

	public close() {}

	private handleMessageEvent(callback?: EventHandlers['onmessage']) {
		return async (data: RawData, isBinary: boolean) => {
			const dataEntity = new WSDataEntity(data, isBinary);
			const message = await dataEntity.json<WSMessage<any>>();

			if (message && callback) await callback(message);
		};
	}

	private handlePingEvent(callback?: EventHandlers['onping']) {
		return async (buffer: Buffer) => {
			callback && (await callback(buffer));
			if (!this.sender) return;
			this.sender.pong();
			this.setSenderTimeout();
		};
	}

	private handleErrorEvent(callback?: EventHandlers['onerror']) {
		return async (event: ErrorEvent) => {
			callback && (await callback(event));
			if (!this.sender) return;
			this.sender.close(1000, 'error');
			this.sender = null;
			console.error(event);
		};
	}

	private handleCloseEvent(callback?: EventHandlers['onclose']) {
		return async (event: CloseEvent) => {
			callback && (await callback(event));
			this.sender = null;
			console.log(event.reason);
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
