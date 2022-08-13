export enum IncubatorMessageEvent {
	MONITORING = "monitoring",
	CONNECTION = "connection",
	INIT_INCUBATION = "initIncubation",
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
	bulbStatus: BulbStatus;
	sensored_at: string;
};

export type InitIncubationValues = {
	roll_intervval: number;
	incubation_duration: number;
	max_temperature: number;
	min_temperature: number;
};
