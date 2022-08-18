import { CardsList, CardWrapper, CardTitle, CartText, LottieIcon } from "@styles/incubationCard";

import { useWS } from "@hooks/useWS";
import { formatters } from "@utils/incubation/formatters";

import clockIcon from "@assets/lotties/clock-icon.json";
import calendarIcon from "@assets/lotties/calendar-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";

import { IncubationData as IncubationDataType, IncubationStatus } from "@interfaces/incubation";

type IncubationDataProps = {
	data: IncubationDataType;
};

export const IncubationData = ({ data }: IncubationDataProps) => {
	const { getWS, unmountWS } = useWS({
		url: `ws://${import.meta.env.VITE_API_HOSTNAME}/incubator/listen`,
		reconnect: false,
	});

	const isFinished = data.status === IncubationStatus.FINISHED && data.finished_at;

	const temperatureRange = (() => {
		const minTemperature = formatters.formatTemperature(data.min_temperature);
		const maxTemperature = formatters.formatTemperature(data.max_temperature);
		return `${minTemperature} - ${maxTemperature}`;
	})();

	const getExpectedFinishTimestamp = () => data.started_at + data.incubation_duration * 1000;

	return (
		<CardsList>
			<CardWrapper>
				<LottieIcon animationData={clockIcon} />
				<CardTitle>Intervalo de rotação</CardTitle>
				<CartText>{formatters.secondsToTimeAcronym(data.roll_interval)}</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={temperatureIcon} />
				<CardTitle>Temperatura de incubação</CardTitle>
				<CartText>{temperatureRange}</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>Início da incubação</CardTitle>
				<CartText>{formatters.formatDate(new Date(data.started_at))}</CartText>
			</CardWrapper>
			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>Tempo de incubação</CardTitle>
				<CartText>{formatters.secondsToTimeAcronym(data.incubation_duration)}</CartText>
			</CardWrapper>

			<CardWrapper>
				<LottieIcon animationData={calendarIcon} />
				<CardTitle>{isFinished ? "Finalizado em" : "Finalizará em"}</CardTitle>
				<CartText>{formatters.formatDate(new Date(getExpectedFinishTimestamp()))}</CartText>
			</CardWrapper>
		</CardsList>
	);
};
