import type { ExceptionFactory } from '@utils/exception';

export const saveFail: ExceptionFactory = (args) => ({
	code: 'ISD-010',
	httpStatus: 500,
	message: 'Falha ao salvar os dados no banco de dados.',
	...args,
});

export const errorsFactory = {
	saveFail,
};
