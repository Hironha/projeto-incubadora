type TimeAcronyms = "d" | "h" | "m" | "s";

const getTimeAcronymsMap = () => {
	const map = new Map<TimeAcronyms, number>();
	map.set("s", 1);
	map.set("m", 60);
	map.set("h", 60 * 60);
	map.set("d", 60 * 60 * 24);
	return map;
};

const parseTimeInputToNumber = (input: string) => {
	const matches = input.match(/(\d[dhms])+/g);
	const timeAcronymsMap = getTimeAcronymsMap();
	if (!matches) return 0;

	return matches.reduce((total, match) => {
		const time = match.match(/\d+/)?.at(0);
		const acronym = match.match(/[dhms]/)?.at(0);
		if (!time || !acronym) return total;

		const acronymValue = timeAcronymsMap.get(acronym as TimeAcronyms);
		if (acronymValue) return total + parseFloat(time) * acronymValue;
		return total;
	}, 0);
};

const parseTemperatureInputToNumber = (input: string) => {
	const match = input.match(/\d+(\.\d+){0,1}/)?.at(0);
	return match ? parseFloat(match) : 0;
};

export const inputParser = {
	timeInputToNumber: parseTimeInputToNumber,
	temperatureInputToNumber: parseTemperatureInputToNumber,
};
