import { IncubationStatus } from '@interfaces/models/incubation';

export interface IGetIncubationDataInput {
	status?: IncubationStatus;
}

export interface IGetIncubationDataOutput {
	status: IncubationStatus;
}
