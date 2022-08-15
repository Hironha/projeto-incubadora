import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loading } from "@components/Loading";
import { ControlForm } from "./components";
import { LoadingContainer, ErrorMessage } from "./styles";

import { useWS, WSStatus } from "@hooks/useWS";
import { inputParser } from "./utils/inputParser";
import {
	IncubatorMessageEvent,
	type IncubatorMessage,
	type InitIncubationValues,
} from "@interfaces/incubatorWS";
import type { FormValues as ControlFormValues } from "./components/ControlForm";

export const StartIncubation = () => {
	const navigate = useNavigate();
	const startIncubationTimeout = useRef<NodeJS.Timeout | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { getWS, status, unmountWS } = useWS({
		url: `ws://${import.meta.env.VITE_API_HOSTNAME}/incubator/listen`,
		reconnect: true,
	});

	const handleControlFormSubmit = async (values: ControlFormValues) => {
		const ws = await getWS();
		const message: IncubatorMessage<InitIncubationValues> = {
			eventName: IncubatorMessageEvent.INIT_INCUBATION,
			data: {
				roll_interval: inputParser.timeInputToNumber(values.rollInterval),
				incubation_duration: inputParser.timeInputToNumber(values.incubationDuration),
				min_temperature: inputParser.temperatureInputToNumber(values.minTemperature),
				max_temperature: inputParser.temperatureInputToNumber(values.maxTemperature),
				started_at: new Date().getTime(),
			},
		};
		if (status.value === WSStatus.CONNECTED) {
			setErrorMessage(null);
			setIsSubmitting(true);

			startIncubationTimeout.current = setTimeout(() => {
				setIsSubmitting(false);
				setErrorMessage("Erro ao inicializar incubação");
			}, 15 * 1000);
			ws.send(JSON.stringify(message));
		}
	};

	useEffect(() => {
		const initWS = async () => {
			const ws = await getWS();

			const handleConnectionEvent = () => status.setStatus(WSStatus.CONNECTED);
			const handleIncubationInitializedEvent = (data: IncubatorMessage<any>) => {
				if (startIncubationTimeout.current) clearTimeout(startIncubationTimeout.current);
				setIsSubmitting(false);
				console.log(data);
			};
			const handleErrorEvent = (message: IncubatorMessage<any>) => {
				if (startIncubationTimeout.current) clearTimeout(startIncubationTimeout.current);
				setIsSubmitting(false);
				setErrorMessage(message.data);
			};

			ws.onmessage = event => {
				const message: IncubatorMessage<any> = JSON.parse(event.data);
				switch (message.eventName) {
					case IncubatorMessageEvent.CONNECTION:
						return handleConnectionEvent();
					case IncubatorMessageEvent.INCUBATION_INITIALIZED:
						return handleIncubationInitializedEvent(event.data);
					case IncubatorMessageEvent.ERROR:
						return handleErrorEvent(event.data);
				}
			};
		};

		initWS();
		return () => unmountWS();
	}, []);

	if (status.value === WSStatus.UNAUTHORIZED) {
		navigate("/login");
		return null;
	}

	if (status.value === WSStatus.CONNECTING) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	return (
		<ControlForm
			errorMessage={errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
			isSubmitting={isSubmitting}
			onSubmit={handleControlFormSubmit}
		/>
	);
};
