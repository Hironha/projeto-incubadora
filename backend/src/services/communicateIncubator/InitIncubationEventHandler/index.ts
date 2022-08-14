import { WSDataEvent } from '@interfaces/utility/connection';
import { InitIncubationDto } from '@dtos/initIncubationData';
import { Left, Right, type Either } from '@utils/management';

import type {
	IInitIncubationEventInput,
	IInitIncubationEventOutput,
} from '@interfaces/ios/ws/initIncubationEvent';
import { IIncubation } from '@interfaces/models/incubation';

export class InitIncubationEventHandler {
	constructor() {}

	public async exec(
		event: IInitIncubationEventInput,
		callback: (data: IInitIncubationEventOutput) => void | Promise<void>
	) {
		const dto = new InitIncubationDto(event.data);
		const getInitIncubationDataFlow = await this.getInitIncubationData(dto);
		if (getInitIncubationDataFlow.isLeft()) return getInitIncubationDataFlow.export();

		const initIncubationData = getInitIncubationDataFlow.export();
		await callback(this.getOutput(initIncubationData));
	}

	public async getInitIncubationData(
		dto: InitIncubationDto
	): Promise<Either<null, Omit<IIncubation, 'status'>>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			console.error(message);
			return new Left(null);
		}
	}

	public getOutput(initIncubationData: Omit<IIncubation, 'status'>): IInitIncubationEventOutput {
		return {
			eventName: WSDataEvent.INIT_INCUBATION,
			data: {
				...initIncubationData,
			},
		};
	}
}
