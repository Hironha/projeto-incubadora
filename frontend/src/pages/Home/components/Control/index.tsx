import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";
import { StartIncubation } from "./components";
import { CardTitle, CardWrapper, CardsList, CartText, LottieIcon } from "@styles/incubationCard";
import { LoadingContainer, Container } from "./styles";

import { api } from "@utils/api";

import temperatureIcon from "@assets/lotties/temperature-icon.json";
import clockIcon from "@assets/lotties/clock-icon.json";
import calendarIcon from "@assets/lotties/calendar-icon.json";

type RequestData<T> = { data?: T; loading: boolean; error?: boolean };

export const Control = () => {
	const [requestData, setRequestData] = useState<RequestData<any>>({
		data: undefined,
		loading: true,
		error: false,
	});

	const handleIncubationInitialized = (data: any) => {
		setRequestData({ data, loading: false, error: false });
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getActiveIncubation = async () => {
			setRequestData(prev => ({ ...prev, loading: true }));
			try {
				const response = await api.get("incubator/incubations", {
					params: { status: "active" },
				});
				if (!isMounted) return;
				setRequestData({ data: response.data && response.data[0], loading: false, error: false });
			} catch (err) {
				if (!isMounted) return;
				setRequestData(prev => ({ ...prev, loading: true, error: true }));
			}
		};

		getActiveIncubation();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	if (requestData.loading) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	if (!requestData.data) {
		return <StartIncubation onIncubationInitialized={handleIncubationInitialized} />;
	}

	return (
		<Container>
			<h2>Incubação em andamento</h2>
			<CardsList>
				<CardWrapper>
					<LottieIcon animationData={clockIcon} />
					<CardTitle>Intervalo de rotação</CardTitle>
					<CartText>{requestData.data.roll_interval}</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={temperatureIcon} />
					<CardTitle>Temperatura de incubação</CardTitle>
					<CartText>
						{requestData.data.min_temperature} - {requestData.data.max_temperature}
					</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={calendarIcon} />
					<CardTitle>Início da incubação</CardTitle>
					<CartText>{new Date(requestData.data.started_at).toUTCString()}</CartText>
				</CardWrapper>
				<CardWrapper>
					<LottieIcon animationData={calendarIcon} />
					<CardTitle>Tempo de incubação</CardTitle>
					<CartText>{requestData.data.incubation_duration}</CartText>
				</CardWrapper>
			</CardsList>
		</Container>
	);
};
