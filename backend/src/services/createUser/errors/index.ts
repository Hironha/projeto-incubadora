import { Exception } from '@utils/exception';

const validationError = new Exception({
	code: 'CU-001',
	httpStatus: 400,
	message: 'Some of the user data is invalid.',
});

const creationError = new Exception({
	code: 'CU-101',
	httpStatus: 500,
	message: 'Failed to create user.',
});

export const errors = { validationError, creationError };
