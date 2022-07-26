export enum IncubationStatus {
	ACTIVE = 'active',
	FINISHED = 'finished',
	CANCELED = 'canceled',
}

export interface IIncubation {
	roll_interval: number;
	incubation_duration: number;
	min_temperature: number;
	max_temperature: number;
	status: IncubationStatus;
	started_at: number;
	finished_at?: number;
}

export interface IIncubationDocData extends IIncubation {
	id: string;
}
