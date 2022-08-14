import type { WSMessage } from '@interfaces/utility/connection';
import type { IIncubation } from '@interfaces/models/incubation';

export interface IIncubationInitializedEventInput extends WSMessage<IIncubation> {}

export interface IIncubationInitializedEventOutput extends WSMessage<IIncubation> {}
