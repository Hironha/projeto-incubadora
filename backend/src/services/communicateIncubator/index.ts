import type * as WebSocket from 'ws';

import { IncubatorRepository } from '@repositories/incubator';
import { WSDataEntity } from '@utils/entity/WSDataEntity';

import type { ISensorData } from '@interfaces/models/sensorData';
import type { IMonitoringDataInput } from '@interfaces/ios/monitoringData';
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
			const sensorData = new WSDataEntity<IMonitoringDataInput>(
				message,
				isBinary
			);

			await this.broadcast(sensorData);
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

	private async broadcast(payload: WSDataEntity<IMonitoringDataInput>) {
		const payloadStringified = await payload.string();
		if (!payloadStringified) return;

		this.listeners.forEach((ws) => ws.send(payloadStringified));

		const payloadJSON = await payload.json();
		if (!payloadJSON) return;

		const sensorData = this.getSensorData(payloadJSON);

		this.sensoredData.push(sensorData);
		if (this.sensoredData.length >= this.maxSensoredData) {
			await this.saveSensorData();
		}
	}

	private async saveSensorData() {
		const accSensoredData = this.sensoredData.reduce(
			(acc, cur) => {
				acc.humidity += cur.humidity;
				acc.temperature += cur.temperature;
				return acc;
			},
			{ humidity: 0, temperature: 0 } as Omit<ISensorData, 'sensored_at'>
		);

		const { humidity, temperature } = accSensoredData;
		const meanSensoredData: ISensorData = {
			humidity: this.toFloat(humidity / this.sensoredData.length, 2),
			temperature: this.toFloat(temperature / this.sensoredData.length, 2),
			sensored_at: new Date().toUTCString(),
		};

		const saveSensorDataFlow = await this.incubatorRepository.saveSensorData(
			meanSensoredData
		);

		if (saveSensorDataFlow.isRight()) {
			this.sensoredData = [];
		}
	}

	private toFloat(value: number, decimals: number = 2) {
		const converter = Math.pow(10, decimals);
		return Math.round(value * converter) / converter;
	}

	private getSensorData(wsData: IMonitoringDataInput): ISensorData {
		return {
			humidity: wsData.humidity,
			temperature: wsData.temperature,
			sensored_at: new Date().toUTCString(),
		};
	}
}
