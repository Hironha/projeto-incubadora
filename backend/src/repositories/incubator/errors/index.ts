import { Exception } from '@utils/exception';

const saveFail = new Exception({
	code: 'ISD-010',
	httpStatus: 500,
	message: 'Falha ao salvar os dados no banco de dados',
});

const getFail = new Exception({
	code: 'ISD-011',
	httpStatus: 500,
	message: 'Falha ao buscar dados no banco de dados',
});

const noActiveIncubation= new Exception({
	code: 'ISD-012',
	httpStatus: 400,
	message: 'Não há nenhuma incubação ativa',
});

export const errorsFactory = {
	saveFail,
	getFail,
	noActiveIncubation
};
