import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loading } from "@components/Loading";
import { ControlForm } from "./components";
import { LoadingContainer } from "./styles";

import { useWS, WSStatus } from "@hooks/useWS";
import { inputParser } from "./utils/inputParser";
import {
	IncubatorMessageEvent,
	type IncubatorMessage,
	type InitIncubationValues,
} from "@interfaces/incubatorWS";
import type { FormValues as ControlFormValues } from "./components/ControlForm";

export const IncubatorControl = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { getWS, status, unmountWS } = useWS({
		url: "ws://192.168.0.2:80/incubator/listen",
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
				started_at: new Date().toISOString(),
			},
		};
		if (status.value === WSStatus.CONNECTED) {
			setIsSubmitting(true);
			ws.send(JSON.stringify(message));
		}
	};

	useEffect(() => {
		const initWS = async () => {
			const ws = await getWS();

			ws.onmessage = event => {
				const message: IncubatorMessage<boolean> = JSON.parse(event.data);
				switch (message.eventName) {
					case IncubatorMessageEvent.CONNECTION:
						status.setStatus(WSStatus.CONNECTED);
						break;
					case IncubatorMessageEvent.INCUBATION_INITIALIZED:
						setIsSubmitting(false);
						break;
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

	return <ControlForm isSubmitting={isSubmitting} onSubmit={handleControlFormSubmit}></ControlForm>;
};
