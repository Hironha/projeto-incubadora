import type * as WebSocket from 'ws';

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
			const jsonStringified = await this.payloadToString(message, isBinary);
			const json = (() => {
				if (!jsonStringified) return null;
				const payload = JSON.parse(jsonStringified);
				payload['sensoredAt'] = new Date().toUTCString();
				return JSON.stringify(payload);
			})();

			this.listeners.forEach((ws) => ws.send(json));
		});

		ws.on('close', () => {
			this.sender = null;
		});
	}

	public addListener(ws: WebSocket) {
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
