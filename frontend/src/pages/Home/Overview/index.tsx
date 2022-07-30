import { useEffect, useRef, useState } from "react";
import {
	Container,
	LottieIcon,
	CardWrapper,
	CardTitle,
	CartText,
	CardsList,
	ImageLogo,
} from "./styles";

import { useWS } from "src/hooks/useWS";

import Logo from "@assets/images/logo.png";
import humidityIcon from "@assets/lotties/humidity-icon.json";
import temperatureIcon from "@assets/lotties/temperature-icon.json";

import type { LottieRef } from "lottie-react";

type SensorData = {
	humidity: number;
	temperature: number;
	sensored_at: string;
};

export const Overview = () => {
	const temperatureRef: LottieRef = useRef(null);
	const humidityRef: LottieRef = useRef(null);
	const [sensorData, setSensorData] = useState<SensorData>();
	const { ws, reconnect, status } = useWS({
		url: "ws://192.168.0.2:80/incubator/listen",
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

	useEffect(() => {
		ws.onmessage = event => {
			console.log(JSON.parse(event.data));
			setSensorData(JSON.parse(event.data));
			temperatureRef.current?.goToAndPlay(0);
			humidityRef.current?.goToAndPlay(0);
		};
	}, []);

	return (
		<Container>
			<ImageLogo src={Logo} alt="Logo incubadora" />
			{sensorData && <h3>Atualizado em {new Date(sensorData.sensored_at).toLocaleString()}</h3>}
			<CardsList>
				<CardWrapper>
					<LottieIcon animationData={humidityIcon} loop={false} lottieRef={humidityRef} />
					<CardTitle>Umidade</CardTitle>
					<CartText>{sensorData ? formatHumidity(sensorData.humidity) : "Não registrado"}</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={temperatureIcon} lottieRef={temperatureRef} loop={false} />
					<CardTitle>Temperatura</CardTitle>
					<CartText>
						{sensorData ? formatCelsius(sensorData.temperature) : "Não Registrado"}
					</CartText>
				</CardWrapper>
			</CardsList>
		</Container>
	);
};
