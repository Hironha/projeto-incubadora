export enum IncubationStatus {
	ACTIVE = "active",
	CANCELED = "canceled",
	FINISHED = "finished",
}

export type IncubationData = {
  id: string;
	incubation_duration: number;
	roll_interval: number;
	started_at: number;
	finished_at?: number;
	status: IncubationStatus;
	min_temperature: number;
	max_temperature: number;
};
