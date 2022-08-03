import { auth } from '@utils/database';

import { Left, Right } from '@utils/management';

import type { Either } from '@utils/management';
import type { IUser } from '@interfaces/models/user';

export class UserRepository {
	public async createUser(user: IUser): Promise<Either<string, IUser>> {
		try {
			await auth.createUser({
				email: user.email,
				password: user.password,
			});
			return new Right(user);
		} catch (err: any) {
			return new Left(err?.message);
		}
	}
}
