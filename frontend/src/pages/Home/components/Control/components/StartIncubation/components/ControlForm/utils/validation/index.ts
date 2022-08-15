import * as Yup from "yup";

import { regexes } from "@utils/regexes";

const temperatureInputToNumber = (input: string) => {
	const match = input.match(/\d+(\.\d+){0,1}/)?.at(0);
	return match ? parseFloat(match) : 0;
};

const validateTimeInput = (input?: string) => {
	if (!input) return false;
	const cleanInput = input.replace(/\s/g, "");
	const timeAcronymPattern = /^(\d+[dhms])+$/gm;

	return timeAcronymPattern.test(cleanInput);
};

const validateTemperature = (value: string | undefined) => {
	if (!value) return false;

	const cleanTemperature = value.replace(/[^\d\.]/g, "");
	return regexes.getFloatPattern().test(cleanTemperature);
};

const validateMaxTemperature = (value: string | undefined, context: Yup.TestContext<any>) => {
	if (!value) return false;

	const minTemperature = temperatureInputToNumber(context.parent.minTemperature);
	const maxTemperature = temperatureInputToNumber(value);
	return maxTemperature > minTemperature;
};

export const validationSchema = Yup.object().shape({
	rollInterval: Yup.string()
		.test("isValidTime", "Intervalo inválido", validateTimeInput)
		.required(),
	incubationDuration: Yup.string()
		.test("isValidDuration", "Intervalo de incubação inválido", validateTimeInput)
		.required(),
	minTemperature: Yup.string()
		.test("isValidMinTemperature", "Temperatura inválida", validateTemperature)
		.required(),
	maxTemperature: Yup.string()
		.test("isValidMaxTemperature", "Temperatura inválida", validateTemperature)
		.test("isBiggerThanMin", "Temperature máxima inválida", validateMaxTemperature)
		.required(),
});
