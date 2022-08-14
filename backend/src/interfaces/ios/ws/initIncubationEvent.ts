import type { WSMessage } from '@interfaces/utility/connection';
import type { IIncubation } from '@interfaces/models/incubation';

export interface IInitIncubationEventInput extends WSMessage<Omit<IIncubation, 'status'>> {}

export interface IInitIncubationEventOutput
	extends WSMessage<Omit<IIncubation, 'status'>> {}
