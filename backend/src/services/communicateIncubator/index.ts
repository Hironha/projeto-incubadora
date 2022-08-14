import type * as WebSocket from 'ws';

import { SenderCommunicator } from './SenderCommunicator';
import { ListenCommunicator } from './ListenCommunicator';

export class CommunicateIncubatorService {
	constructor(
		private sender = new SenderCommunicator(),
		private listeners = new ListenCommunicator()
	) {}

	public addSender(ws: WebSocket, ttl?: number) {
		this.sender.setSender(ws, this.listeners);
	}

	public addListener(ws: WebSocket) {
		this.listeners.addListener(ws, this.sender);
	}
}
