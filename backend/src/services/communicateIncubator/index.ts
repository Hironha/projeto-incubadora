import type * as WebSocket from 'ws';

export class CommunicateIncubatorService {
	private listeners: Map<number, WebSocket> = new Map();
	private timeout: NodeJS.Timeout | null = null;
	private sender: WebSocket | null = null;
	private ttl: number;

	constructor(ttl: number = 30 * 1000) {
		this.ttl = ttl;
	}

	public addSender(ws: WebSocket) {
		ws.onopen = () => {
			this.sender = ws;
			this.setServerTimeout();
		};

		ws.onerror = (err) => {
			this.sender = null;
			console.error(err);
		};

		ws.onclose = () => {
			this.sender = null;
		};

		ws.on('ping', () => {
			ws.pong();
			this.setServerTimeout();
		});

		ws.on('message', async (message, isBinary) => {
			const payload = await this.formatPayloadToClient(message, isBinary);
			if (payload) this.listeners.forEach((ws) => ws.send(payload));
		});
	}

	public addListener(ws: WebSocket) {
		const key = this.listeners.size;
		this.listeners.set(key, ws);

		ws.on('close', () => this.listeners.delete(key));
	}

	private setServerTimeout() {
		if (this.timeout) clearInterval(this.timeout);

		this.timeout = setTimeout(() => {
			if (this.sender) this.sender.close(1000);
		}, this.ttl);
	}

	private async formatPayloadToClient(
		data: string | Blob | WebSocket.RawData,
		isBinary: boolean
	) {
		const paylodStringified = await this.payloadToString(data, isBinary);
		if (!paylodStringified || !this.isJSON(paylodStringified)) return null;
		return paylodStringified;
	}

	private isJSON(json: string) {
		try {
			JSON.parse(json);
			return true;
		} catch (err) {
			return false;
		}
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
