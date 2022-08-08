export enum IncubatorMessageEvent {
	MONITORING = "monitoring",
	CONNECTION = "connection",
  INIT_INCUBATION = 'initIncubation'
}

export enum IncubatorCloseEvent {
	UNAUTHORIZED = "unauthorized",
}

export type IncubatorMessage<T> = {
	eventName: IncubatorMessageEvent;
	data: T;
};
