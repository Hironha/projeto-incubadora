import { useEffect, useRef, useState } from "react";
import {
	Container,
	LottieIcon,
	CardWrapper,
	CardTitle,
	CartText,
	CardsList,
	ImageLogo,
	LoadingContainer,
} from "./styles";

import { Button } from "@components/Button";

import { useWS, WSStatus } from "@hooks/useWS";

import Logo from "@assets/images/logo.png";
import humidityIcon from "@assets/lotties/humidity-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";
import clockIcon from "@assets/lotties/clock-icon.json";
import calendarIcon from "@assets/lotties/calendar-icon.json";

import type { LottieRef } from "lottie-react";
import {
	IncubatorMessageEvent,
	type IncubatorMessage,
	type SensorData,
} from "@interfaces/incubatorWS";
import { Loading } from "@components/Loading";

export const Overview = () => {
	const humidityRef: LottieRef = useRef(null);
	const temperatureRef: LottieRef = useRef(null);
	const [sensorData, setSensorData] = useState<SensorData>();
	const { getWS, reconnect, status, unmountWS } = useWS({
		url: `ws://${import.meta.env.VITE_API_HOSTNAME}/incubator/listen`,
		reconnect: true,
	});

	const formatCelsius = (temperature: number) => {
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

	const handleReconnect = () => reconnect();

	useEffect(() => {
		const handleMonitoringMessage = (data: SensorData) => {
			setSensorData(data);
			temperatureRef.current?.goToAndPlay(0);
			humidityRef.current?.goToAndPlay(0);
		};

		const handleConnectionMessage = () => {
			status.setStatus(WSStatus.CONNECTED);
		};

		const initWS = async () => {
			const ws = await getWS();
			ws.onmessage = event => {
				const message: IncubatorMessage<unknown> = JSON.parse(event.data);
				if (message.eventName === IncubatorMessageEvent.MONITORING) {
					handleMonitoringMessage(message.data as SensorData);
				}

				if (message.eventName === IncubatorMessageEvent.CONNECTION) {
					message.data && handleConnectionMessage();
				}
			};
		};

		initWS();

		return () => unmountWS();
	}, [getWS, unmountWS, status.setStatus]);

	if (status.value === WSStatus.CONNECTING) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	return (
		<Container>
			<ImageLogo src={Logo} alt="Logo incubadora" />
			{sensorData && <h3>Atualizado em {new Date(sensorData.sensored_at).toLocaleString()}</h3>}
			{status.value === WSStatus.RECONNECTING && <h3>Conexão perdida. Tentando reconexão...</h3>}
			{status.value === WSStatus.DISCONNECTED && (
				<Button styleType="primary" onClick={handleReconnect}>
					Reconectar
				</Button>
			)}
			<CardsList>
				<CardWrapper>
					<LottieIcon animationData={humidityIcon} loop={false} lottieRef={humidityRef} />
					<CardTitle>Umidade atual</CardTitle>
					<CartText>{sensorData ? formatHumidity(sensorData.humidity) : "Não Registrado"}</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={temperatureIcon} lottieRef={temperatureRef} loop={false} />
					<CardTitle>Temperatura atual</CardTitle>
					<CartText>
						{sensorData ? formatCelsius(sensorData.temperature) : "Não Registrado"}
					</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={clockIcon} loop={false} />
					<CardTitle>Estado da lâmpada</CardTitle>
					<CartText>{sensorData?.bulbStatus || "Não Registrado"}</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={clockIcon} loop={false} />
					<CardTitle>Intervalo de rotação</CardTitle>
					<CartText>1 Hora</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={temperatureIcon} loop={false} />
					<CardTitle>Temperatura de incubação</CardTitle>
					<CartText>36°C - 38°C</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={calendarIcon} loop={false} />
					<CardTitle>Início da incubação</CardTitle>
					<CartText>04/08/2022</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={calendarIcon} loop={false} />
					<CardTitle>Tempo de incubação</CardTitle>
					<CartText>21 dias</CartText>
				</CardWrapper>
			</CardsList>
		</Container>
	);
};
