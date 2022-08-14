import { WSDataEvent, WSMessage } from '@interfaces/utility/connection';
import { InitIncubationDto } from '@dtos/initIncubationData';
import { Left, Right, type Either } from '@utils/management';
import { IncubatorRepository } from '@repositories/incubator';

import type {
	IInitIncubationEventInput,
	IInitIncubationEventOutput,
} from '@interfaces/ios/ws/initIncubationEvent';
import type { IIncubation } from '@interfaces/models/incubation';
import type { WebSocket } from 'ws';
import type { SenderCommunicator } from '@services/communicateIncubator/SenderCommunicator';

export class InitIncubationEventHandler {
	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public async exec(event: IInitIncubationEventInput, ws: WebSocket, sender: SenderCommunicator) {
		const dto = new InitIncubationDto(event.data);
		const getInitIncubationDataFlow = await this.getInitIncubationData(dto);
		if (getInitIncubationDataFlow.isLeft()) return getInitIncubationDataFlow.export();

		const checkHasActiveIncubationFlow = await this.checkHasActiveIncubation();
		if (checkHasActiveIncubationFlow.isLeft()) return;

		if (!checkHasActiveIncubationFlow.export()) {
			const initIncubationData = getInitIncubationDataFlow.export();
			sender.sendMessage(initIncubationData);
		}
		this.notifyActiveIncubation(ws);
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

	private notifyActiveIncubation(ws: WebSocket) {
		const notification: WSMessage<string> = {
			eventName: WSDataEvent.ERROR,
			data: 'Não é possível inicializar outra incubação, pois há uma em andamento',
		};
		ws.send(JSON.stringify(notification));
	}

	private async checkHasActiveIncubation() {
		try {
			const getActiveIncubationFlow = await this.incubatorRepository.getActiveIncubation();
			if (getActiveIncubationFlow.isLeft()) return getActiveIncubationFlow;

			return new Right(!!getActiveIncubationFlow.export());
		} catch (err) {
			return new Left(null);
		}
	}
}
