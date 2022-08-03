import type * as WebSocket from 'ws';

import { IncubatorRepository } from '@repositories/incubator';

import type { ISensorData } from '@interfaces/models/sensorData';
export class CommunicateIncubatorService {
	private listeners: Map<number, WebSocket> = new Map();
	private timeout: NodeJS.Timeout | null = null;
	private sender: WebSocket | null = null;
	private ttl: number = 30 * 1000;
	private sensoredData: ISensorData[] = [];
	private maxSensoredData = 10;

	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public addSender(ws: WebSocket, ttl?: number) {
		this.sender = ws;
		this.ttl = ttl ? ttl : this.ttl;
		this.setServerTimeout();

		ws.onerror = (err) => {
			if (!this.sender) return;

			this.sender.close(1000, 'error');
			this.sender = null;
			console.error(err);
		};

		ws.onclose = (event) => {
			this.sender = null;
		};

		ws.on('ping', () => {
			console.log('pinged');
			ws.pong();
			this.setServerTimeout();
		});

		ws.on('message', async (message, isBinary) => {
			const payload = await this.formatPayloadToClient(message, isBinary);
			console.log(payload);
			if (payload) {
				await this.broadcast(payload);
			}
		});
	}

	public addListener(ws: WebSocket) {
		const key = this.listeners.size;
		this.listeners.set(key, ws);

		ws.onclose = () => this.listeners.delete(key);
	}

	private setServerTimeout() {
		if (this.timeout) clearTimeout(this.timeout);

		this.timeout = setTimeout(() => {
			if (this.sender) {
				this.sender.close(1000);
				this.sender = null;
			}
		}, this.ttl);
	}

	private async broadcast(payload: string) {
		this.listeners.forEach((ws) => ws.send(payload));
		this.sensoredData.push(JSON.parse(payload));
		if (this.sensoredData.length < this.maxSensoredData) return;

		const accSensoredData = this.sensoredData.reduce(
			(acc, cur) => {
				acc.humidity += cur.humidity;
				acc.temperature += cur.temperature;
				return acc;
			},
			{ humidity: 0, temperature: 0 } as Omit<ISensorData, 'sensored_at'>
		);

		const meanSensoredData: ISensorData = {
			humidity: accSensoredData.humidity / this.sensoredData.length,
			temperature: accSensoredData.temperature / this.sensoredData.length,
			sensored_at: new Date().toUTCString(),
		};

		const saveSensorDataFlow = await this.incubatorRepository.saveSensorData(
			meanSensoredData
		);

		if (saveSensorDataFlow.isRight()) {
			this.sensoredData = [];
		}
	}

	private async formatPayloadToClient(
		data: string | Blob | WebSocket.RawData,
		isBinary: boolean
	) {
		const payloadStringified = await this.payloadToString(data, isBinary);
		if (!payloadStringified) return null;

		const payload = this.toJSON(payloadStringified);
		if (!payload) return null;

		(payload as ISensorData)['sensored_at'] = new Date().toUTCString();

		return JSON.stringify(payload);
	}

	private toJSON(json: string) {
		try {
			return JSON.parse(json) as Pick<ISensorData, 'humidity' | 'temperature'>;
		} catch (err) {
			return null;
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
