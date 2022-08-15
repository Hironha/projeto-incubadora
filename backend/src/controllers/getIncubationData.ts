import { Controller } from '@utils/controller';
import { GetIncubationDataService } from '@services/getIncubationData';
import { GetIncubationDataDto } from '@dtos/getIncubationData';

import type { Exception } from '@utils/exception';
import type { ParsedQs } from 'qs';
import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export class GetIncubationDataController extends Controller {
	constructor(private getIncubationsDataService = new GetIncubationDataService()) {
		super();
	}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.query;
			const dto = new GetIncubationDataDto(input);

			const data = await this.getIncubationsDataService.exec(dto);

			res.status(200).json(data);
		} catch (err) {
			console.error(err);
			const { code, httpStatus, message } = (err as Exception).export();
			res.status(httpStatus).send({ code, message });
		}
	}
}
