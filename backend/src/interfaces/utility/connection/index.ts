import type { CloseEvent, ErrorEvent, Event } from 'ws';

export enum ConnectionCloseEvent {
	UNAUTHORIZED = 'unauthorized',
}

export enum WSDataEvent {
	MONITORING = 'monitoring',
	CONNECTION = 'connection',
	INIT_INCUBATION = 'initIncubation',
}

export type WSMessage<T> = {
	eventName: WSDataEvent;
	data: T;
};

export type EventHandlers = {
	onmessage: (message: WSMessage<any>) => void | Promise<void>;
	onclose: (event: CloseEvent) => void | Promise<void>;
	onerror: (event: ErrorEvent) => void | Promise<void>;
	onopen: (event: Event) => void | Promise<void>;
	onping: (buffer: Buffer) => void | Promise<void>;
};
