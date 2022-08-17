import { CardsList, CardWrapper, CardTitle, CartText, LottieIcon } from "@styles/incubationCard";

import clockIcon from "@assets/lotties/clock-icon.json";
import calendarIcon from "@assets/lotties/calendar-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";

import { IncubationData as IncubationDataType, IncubationStatus } from "@interfaces/incubation";

type IncubationDataProps = {
	data: IncubationDataType;
};

export const IncubationData = ({ data }: IncubationDataProps) => {
	const isFinished = data.status === IncubationStatus.FINISHED && data.finished_at;

	const secondsToTimeAcronym = (seconds: number) => {
		const acronymsInSeconds = { d: 86400, h: 3600, m: 60, s: 1 };
		let timeInSeconds = seconds;
		const timeAcronyms = Object.entries(acronymsInSeconds).map(([acronym, value]) => {
			const acronymValue = Math.round(timeInSeconds / value);
			timeInSeconds -= acronymValue * value;
			return acronymValue ? acronymValue.toString().concat(acronym) : "";
		});

		return timeAcronyms.join(" ").trim();
	};

	const getExpectedFinishTimestamp = () => data.started_at + data.incubation_duration * 1000;

	const formatDate = (date: Date) => {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const fullYear = date.getFullYear();
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${day}/${month}/${fullYear} ${hours}:${minutes}`;
	};

	const formatTemperature = (temperature: number) => `${temperature} °C`;

	return (
		<CardsList>
			<CardWrapper>
				<LottieIcon animationData={clockIcon} />
				<CardTitle>Intervalo de rotação</CardTitle>
				<CartText>{secondsToTimeAcronym(data.roll_interval)}</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={temperatureIcon} />
				<CardTitle>Temperatura de incubação</CardTitle>
				<CartText>
					{formatTemperature(data.min_temperature)} - {formatTemperature(data.max_temperature)}
				</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>Início da incubação</CardTitle>
				<CartText>{formatDate(new Date(data.started_at))}</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>Tempo de incubação</CardTitle>
				<CartText>{secondsToTimeAcronym(data.incubation_duration)}</CartText>
			</CardWrapper>

			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>{isFinished ? "Finalizado em" : "Finalizará em"}</CardTitle>
				<CartText>{formatDate(new Date(getExpectedFinishTimestamp()))}</CartText>
			</CardWrapper>
		</CardsList>
	);
};
