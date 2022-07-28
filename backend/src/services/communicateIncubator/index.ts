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

		ws.on('message', async (message, isBinary) => {
			const payload = await this.payloadToString(message, isBinary);
			this.listeners.forEach((ws) => ws.send(payload));
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

	private async payloadToString(
		data: string | Blob | WebSocket.RawData,
		isBinary: boolean
	) {
		if (isBinary) return await (data as Blob).text();
		if (typeof data === 'string') return data;
		if (Buffer.isBuffer(data)) return JSON.stringify(data.toString());
		return null;
	}
}
