import * as Yup from "yup";

const temperaturePattern = /^(\d+(\.\d+){0,1})$/g;

export const maskTemperature = (input: string) => {
	const isValidTemperature = temperaturePattern.test(input);
	if (isValidTemperature) return input.replace(temperaturePattern, "$1 °C");
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

export const getValidationSchema = () => {
	const validateTemperature = (value?: string) => {
		if (!value) return false;

		const cleanTemperature = value.replace(/[^\d\.]/g, "");
		return temperaturePattern.test(cleanTemperature) ? true : false;
	};

	return Yup.object().shape({
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
};
