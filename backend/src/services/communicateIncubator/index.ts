import type * as WebSocket from 'ws';
import type { IIncubatorData } from '@interfaces/models/incubatorData';

export class CommunicateIncubatorService {
	private listeners: Map<number, WebSocket> = new Map();
	private sender: WebSocket | null = null;

	constructor() {}

	public addSender(ws: WebSocket) {
		this.sender = ws;

		ws.on('error', (err) => {
			console.error(err);
			this.sender = null;
		});

		ws.on('ping', () => ws.pong());

		ws.on('message', (message) => {
			this.listeners.forEach((ws) => ws.send(message));
		});

		ws.on('close', () => {
			this.sender = null;
		});
	}

	public addListener(ws: WebSocket) {
		if (!this.sender) return ws.close();

		const key = this.listeners.size;
		this.listeners.set(key, ws);

		ws.on('close', () => this.listeners.delete(key));
	}
}
