import type * as WebSocket from 'ws';

import { IncubatorRepository } from '@repositories/incubator';
import { SenderCommunicator } from './SenderCommunicator';
import { ListenCommunicator } from './ListenCommunicator';
import { MonitoringEventHandler } from './MonitoringEventHandler';

import { WSDataEvent, WSMessage } from '@interfaces/utility/connection';

import type { ISensorData } from '@interfaces/models/sensorData';
import type { IMonitoringEventInput } from '@interfaces/ios/ws/monitoringData';
export class CommunicateIncubatorService {
	private sensoredData: ISensorData[] = [];
	private maxSensoredData = 10;
	private listeners = new ListenCommunicator();
	private sender = new SenderCommunicator();

	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public addSender(ws: WebSocket, ttl?: number) {
		const handleMessageEvent = async (message: WSMessage<any>) => {
			if (message.eventName === WSDataEvent.MONITORING) {
				await new MonitoringEventHandler(message).exec((output) =>
					this.broadcast(output)
				);
			}
		};

		this.sender.setSender(ws, { onmessage: handleMessageEvent });
	}

	public addListener(ws: WebSocket) {
		this.listeners.addListener(ws);
	}

	private async broadcast(input: IMonitoringEventInput) {
		this.listeners.broadcast(input);
		const sensorData = this.getSensorData(input);

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

	private getSensorData(wsData: IMonitoringEventInput): ISensorData {
		return {
			humidity: wsData.data.humidity,
			temperature: wsData.data.temperature,
			sensored_at: new Date().toUTCString(),
		};
	}
}
