import * as Yup from "yup";

export const getTemperaturePattern = () => /^(\d+(\.\d+){0,1})$/g;

export const maskTemperature = (input: string) => {
	const isValidTemperature = getTemperaturePattern().test(input);
	if (isValidTemperature) return input.replace(getTemperaturePattern(), "$1 °C");
	return input;
};

export const validateTimeInput = (input?: string) => {
	if (!input) return false;

	const timePattern = /\d+(\.\d+){0,1}[dhms]/g;
	const matches = input.match(timePattern);
	if (!matches) return false;

	const usedSuffixes = new Set(matches.map(match => match.replace(/\d/g, "")));
	return Array.from(usedSuffixes).join("") === input.replace(/[^a-z]/g, "");
};

const validateTemperature = (value?: string) => {
	if (!value) return false;

	const cleanTemperature = value.replace(/[^\d\.]/g, "");
	return getTemperaturePattern().test(cleanTemperature);
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
		.required(),
});
