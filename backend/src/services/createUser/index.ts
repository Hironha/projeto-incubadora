import { Service } from '@utils/service';
import { CreateUserDto } from '@dtos/createUser';

import { Left, Right, type Either } from '@utils/management';
import { errors } from './errors';
import { UserRepository } from '@repositories/user';

import type { Exception } from '@utils/exception';
import type { IUser } from '@interfaces/models/user';
import type {
	ICreateUserInput,
	ICreateUserOutput,
} from '@interfaces/ios/createUser';

export class CreateUserService
	implements Service<CreateUserDto, ICreateUserOutput>
{
	constructor(private userRepository = new UserRepository()) {}

	public async exec(input: CreateUserDto): Promise<ICreateUserOutput> {
		const getUserFlow = await this.getUser(input);
		if (getUserFlow.isLeft()) throw getUserFlow.export();

		const createUserFlow = await this.createUser(getUserFlow.export());
		if (createUserFlow.isLeft()) throw createUserFlow.export();

		return {};
	}

	private async getUser(
		input: CreateUserDto
	): Promise<Either<Exception, ICreateUserInput>> {
		try {
			await input.validate();
			return new Right(input.export());
		} catch (err) {
			const message = (err as Error).message;
			return new Left(errors.validationError.edit({ message }));
		}
	}

	private async createUser(user: IUser): Promise<Either<Exception, IUser>> {
		const createUserFlow = await this.userRepository.createUser(user);
		if (createUserFlow.isRight()) return createUserFlow;

		const message = createUserFlow.export();
		return new Left(errors.creationError.edit({ message }));
	}
}
