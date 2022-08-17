import { Controller } from '@utils/controller';
import { CreateUserDto } from '@dtos/createUser';
import { CreateUserService } from '@services/createUser';

import type { Exception } from '@utils/exception';
import type { ParsedQs } from 'qs';
import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export class CreateUserController extends Controller {
	constructor(private createUserService = new CreateUserService()) {
		super();
	}

	public async handleRequest(
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		res: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const input = req.body;
			console.log(input);
			const dto = new CreateUserDto(input);

			await this.createUserService.exec(dto);

			res.status(200).json();
		} catch (err) {
			console.error(err);
			const { code, httpStatus, message } = (err as Exception).export();
			res.status(httpStatus).send({ code, message });
		}
	}
}
