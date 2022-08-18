export enum IncubatorMessageEvent {
	ERROR = "error",
	MONITORING = "monitoring",
	CONNECTION = "connection",
	INIT_INCUBATION = "initIncubation",
	INCUBATION_FINISHED = "incubationFinished",
	INCUBATION_INITIALIZED = "incubationInitialized",
}

export enum IncubatorCloseEvent {
	UNAUTHORIZED = "unauthorized",
}

export type IncubatorMessage<T> = {
	eventName: IncubatorMessageEvent;
	data: T;
};

export enum BulbStatus {
	ON = "on",
	OFF = "off",
}

export type SensorData = {
	humidity: number;
	temperature: number;
	bulb_status: BulbStatus;
	sensored_at: string;
};

export type InitIncubationValues = {
	roll_interval: number;
	incubation_duration: number;
	max_temperature: number;
	min_temperature: number;
	started_at: number;
};
