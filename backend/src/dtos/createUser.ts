import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Validator } from '@utils/validator';
import { validationMessages as messages } from '@utils/validator/validations';

import type { IUser } from '@interfaces/models/user';
import type { ICreateUserInput } from '@interfaces/ios/createUser';

export class CreateUserDto
	extends Validator<ICreateUserInput>
	implements ICreateUserInput
{
	@IsEmail(null, { message: messages.email })
	@IsString({ message: messages.string })
	@IsNotEmpty({ message: messages.isRequired })
	email: string;

	@IsString({ message: messages.string })
	@IsNotEmpty({ message: messages.isRequired })
	password: string;

	constructor(input: Partial<ICreateUserInput>) {
		super(input);
	}

	public export(): IUser {
		return {
			email: this.email,
			password: this.password,
		};
	}
}
