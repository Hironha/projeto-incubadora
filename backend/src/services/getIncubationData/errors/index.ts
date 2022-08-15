import { Exception } from '@utils/exception';

const validationError = new Exception({
	code: 'CU-001',
	httpStatus: 400,
	message: 'Some of the user data is invalid.',
});

export const errors = { validationError };
