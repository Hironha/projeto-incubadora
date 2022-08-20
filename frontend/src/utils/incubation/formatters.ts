const formatDate = (date: Date) => {
	const day = date.getDate().toString().padStart(2, "0");
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const fullYear = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${day}/${month}/${fullYear} ${hours}:${minutes}`;
};

const secondsToTimeAcronym = (seconds: number) => {
	const acronymsInSeconds = { d: 86400, h: 3600, m: 60, s: 1 };
	let timeInSeconds = seconds;
	const timeAcronyms = Object.entries(acronymsInSeconds).map(([acronym, value]) => {
		const acronymValue = Math.floor(timeInSeconds / value);
		timeInSeconds -= acronymValue * value;
		return acronymValue ? acronymValue.toString().concat(acronym) : "";
	});

	return timeAcronyms.join(" ").trim();
};

const formatTemperature = (temperature: number) => {
	const formatter = new Intl.NumberFormat("pt-br", {
		notation: "standard",
		maximumFractionDigits: 2,
	});
	return `${formatter.format(temperature)} °C`;
};

const formatHumidity = (humidity: number) => {
	const formatter = new Intl.NumberFormat("pt-br", {
		notation: "standard",
		maximumFractionDigits: 2,
	});
	return `${formatter.format(humidity)}%`;
};

export const formatters = {
	formatDate,
	formatHumidity,
	formatTemperature,
	secondsToTimeAcronym,
};
