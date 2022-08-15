import { GetIncubationDataDto } from '@dtos/getIncubationData';
import { IncubatorRepository } from '@repositories/incubator';
import { Right, Left } from '@utils/management';

import { errors } from './errors';

export class GetIncubationDataService {
	constructor(private incubatorRepository = new IncubatorRepository()) {}

	public async exec(dto: GetIncubationDataDto) {
		const getQueryParamsFlow = await this.getQueryParams(dto);
		if (getQueryParamsFlow.isLeft()) throw getQueryParamsFlow.export();
		const params = getQueryParamsFlow.export();

		const getIncubationsDataFlow = await this.incubatorRepository.getIncubationByStatus(
			params.status
		);
		if (getIncubationsDataFlow.isLeft()) throw getIncubationsDataFlow.export();

		return getIncubationsDataFlow.export();
	}

	private async getQueryParams(dto: GetIncubationDataDto) {
		try {
			await dto.validate();
			return new Right(dto.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(errors.validationError.edit({ message }));
		}
	}
}
