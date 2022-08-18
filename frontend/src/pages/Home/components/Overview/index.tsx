import { useEffect, useRef, useState } from "react";

import { Button } from "@components/Button";
import { Loading } from "@components/Loading";
import { LottieIcon, CardWrapper, CardTitle, CartText, CardsList } from "@styles/incubationCard";
import { ImageLogo, LoadingContainer, Container } from "./styles";

import { useWS, WSStatus } from "@hooks/useWS";
import { formatters } from "@utils/incubation/formatters";

import Logo from "@assets/images/logo.png";
import humidityIcon from "@assets/lotties/humidity-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";
import clockIcon from "@assets/lotties/clock-icon.json";

import type { LottieRef } from "lottie-react";
import {
	IncubatorMessageEvent,
	type IncubatorMessage,
	type SensorData,
} from "@interfaces/incubatorWS";

export const Overview = () => {
	const humidityRef: LottieRef = useRef(null);
	const temperatureRef: LottieRef = useRef(null);
	const [sensorData, setSensorData] = useState<SensorData>();
	const { getWS, reconnect, status, unmountWS } = useWS({
		url: `ws://${import.meta.env.VITE_API_HOSTNAME}/incubator/listen`,
		reconnect: true,
	});

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
					<CartText>
						{sensorData ? formatters.formatHumidity(sensorData.humidity) : "Não Registrado"}
					</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={temperatureIcon} lottieRef={temperatureRef} loop={false} />
					<CardTitle>Temperatura atual</CardTitle>
					<CartText>
						{sensorData ? formatters.formatTemperature(sensorData.temperature) : "Não Registrado"}
					</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={clockIcon} loop={false} />
					<CardTitle>Estado da lâmpada</CardTitle>
					<CartText>{sensorData?.bulbStatus || "Não Registrado"}</CartText>
				</CardWrapper>
			</CardsList>
		</Container>
	);
};
