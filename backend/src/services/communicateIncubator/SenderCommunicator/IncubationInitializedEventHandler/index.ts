import { WSDataEvent } from '@interfaces/utility/connection';
import { IncubationInitializedDto } from '@dtos/incubationInitializedData';
import { IncubatorRepository } from '@repositories/incubator';

import { Left, Right, type Either } from '@utils/management';

import type {
	IIncubationInitializedEventInput,
	IIncubationInitializedEventOutput,
} from '@interfaces/ios/ws/incubationInitializedEvent';
import type { IIncubation } from '@interfaces/models/incubation';

export class IncubationInitializedEventHandler {
	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public async exec(
		event: IIncubationInitializedEventInput,
		callback: (data: IIncubationInitializedEventOutput) => void | Promise<void>
	) {
		const dto = new IncubationInitializedDto(event.data);
		const getIncubationInitializedFlow = await this.getIncubationInitializedData(dto);
		if (getIncubationInitializedFlow.isLeft()) return getIncubationInitializedFlow.export();

		const incubationInitializedData = getIncubationInitializedFlow.export();

		const saveIncubationFlow = await this.incubatorRepository.saveIncubationInitialized(
			incubationInitializedData.data
		);
		if (saveIncubationFlow.isLeft()) console.error(saveIncubationFlow.export());
		await callback(incubationInitializedData);
	}

	private async getIncubationInitializedData(
		dto: IncubationInitializedDto
	): Promise<Either<null, IIncubationInitializedEventOutput>> {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			console.error(message);
			return new Left(null);
		}
	}
}
