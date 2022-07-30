import { db } from '@utils/database';

import { Left, Right } from '@utils/management';
import { errorsFactory as errors } from './errors';

import type { Either } from '@utils/management';
import type { IException } from '@utils/exception';
import type { ISensorData } from '@interfaces/models/incubatorData';

export class IncubatorRepository {
	private sensorCollection = 'sensor';

	constructor() {}

	public async saveSensorData(
		sensorData: ISensorData
	): Promise<Either<IException, ISensorData>> {
		try {
			await db.collection(this.sensorCollection).add(sensorData);
			return new Right(sensorData);
		} catch (err) {
      console.log(err)
			return new Left(errors.saveFail());
		}
	}
}
