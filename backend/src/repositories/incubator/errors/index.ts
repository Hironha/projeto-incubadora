import { Exception } from '@utils/exception';

const saveFail = new Exception({
	code: 'ISD-010',
	httpStatus: 500,
	message: 'Falha ao salvar os dados no banco de dados.',
});
export const errorsFactory = {
	saveFail,
};
