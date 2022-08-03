import { db } from '@utils/database';

import { Left, Right } from '@utils/management';
import { errorsFactory as errors } from './errors';

import type { Either } from '@utils/management';
import type { Exception } from '@utils/exception';
import type { ISensorData } from '@interfaces/models/sensorData';

export class IncubatorRepository {
	private sensorCollection = 'sensor';

	constructor() {}

	public async saveSensorData(
		sensorData: ISensorData
	): Promise<Either<Exception, ISensorData>> {
		try {
			await db.collection(this.sensorCollection).add(sensorData);

			return new Right(sensorData);
		} catch (err) {
			console.log(err);
			return new Left(errors.saveFail);
		}
	}
}
