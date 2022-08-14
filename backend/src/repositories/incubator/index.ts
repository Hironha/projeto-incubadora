import { db } from '@utils/database';

import { Left, Right } from '@utils/management';
import { errorsFactory as errors } from './errors';
import {
	type IIncubation,
	IncubationStatus,
	IIncubationDocData,
} from '@interfaces/models/incubation';

import type { Either } from '@utils/management';
import type { Exception } from '@utils/exception';
import type { ISensorData } from '@interfaces/models/sensorData';

export class IncubatorRepository {
	private sensorCollection = 'sensor';
	private incubationsCollection = 'incubations';

	constructor() {}

	public async saveSensorData(sensorData: ISensorData): Promise<Either<Exception, ISensorData>> {
		try {
			const getActiveIncubationFlow = await this.getActiveIncubation();
			if (getActiveIncubationFlow.isLeft()) return getActiveIncubationFlow;

			const activeIncubationData = getActiveIncubationFlow.export();
			if (!activeIncubationData) return new Left(errors.noActiveIncubation);

			await db
				.collection(this.incubationsCollection)
				.doc(activeIncubationData?.id)
				.collection(this.sensorCollection)
				.add(sensorData);

			return new Right(sensorData);
		} catch (err) {
			console.error(err);
			return new Left(errors.saveFail);
		}
	}

	public async saveIncubationInitialized(incubationData: IIncubation) {
		try {
			await db.collection(this.incubationsCollection).add(incubationData);
			return new Right(incubationData);
		} catch (err) {
			console.error(err);
			return new Left(errors.saveFail);
		}
	}

	public async getActiveIncubation() {
		try {
			const snapshot = await db
				.collection(this.incubationsCollection)
				.where('status', '==', IncubationStatus.ACTIVE)
				.get();

			if (snapshot.empty) return new Right(null);

			return new Right({
				id: snapshot.docs.at(0)?.id,
				...snapshot.docs.at(0)?.data,
			} as IIncubationDocData);
		} catch (err) {
			console.error(err);
			return new Left(errors.getFail);
		}
	}
}
