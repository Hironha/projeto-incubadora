export enum ConnectionCloseEvent {
	UNAUTHORIZED = 'unauthorized',
}

export enum WSDataEvent {
	MONITORING = 'monitoring',
	CONNECTION = 'connection',
	INIT_INCUBATION = 'initIncubation'
}

export type WSMessage<T> = {
	eventName: WSDataEvent;
	data: T;
};
