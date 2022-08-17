import { IncubationFinishedDataDto } from '@dtos/incubationFinishedData';
import { Right, Left } from '@utils/management';

import { IncubatorRepository } from '@repositories/incubator';
import { ListenCommunicator } from '@services/communicateIncubator/ListenCommunicator';
import { IncubationStatus } from '@interfaces/models/incubation';
import type { IIncubationFinishedEventInput } from '@interfaces/ios/ws/incubationFinishedEvent';

export class IncubationFinishedEventHandler {
	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public async exec(event: IIncubationFinishedEventInput, listeners: ListenCommunicator) {
		const dto = new IncubationFinishedDataDto(event);
		const getIncubationFinishedDataFlow = await this.getIncubationFinishedData(dto);
		if (getIncubationFinishedDataFlow.isLeft()) return;

		const activeIncubationFlow = await this.incubatorRepository.getActiveIncubation();
		if (activeIncubationFlow.isLeft()) return;

		const activeIncubationData = activeIncubationFlow.export();
		if (!activeIncubationData) return;

		await this.incubatorRepository.updateById(activeIncubationData.id, {
			status: IncubationStatus.FINISHED,
			finished_at: new Date().getTime()
		});

		listeners.broadcast(getIncubationFinishedDataFlow.export());
	}

	private async getIncubationFinishedData(dto: IncubationFinishedDataDto) {
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
