export enum ConnectionCloseEvent {
	UNAUTHORIZED = 'unauthorized',
}

export enum WSDataEvent {
	ERROR = 'error',
	MONITORING = 'monitoring',
	CONNECTION = 'connection',
	INIT_INCUBATION = 'initIncubation',
	INCUBATION_INITIALIZED = 'incubationInitialized',
}

export type WSMessage<T> = {
	eventName: WSDataEvent;
	data: T;
};
