import { useEffect } from "react";
import { useWS, WSStatus } from "@hooks/useWS";

import { Loading } from "@components/Loading";
import { ControlForm } from "./components";
import { LoadingContainer } from "./styles";

import { inputParser } from "./utils/inputParser";
import {
	IncubatorMessageEvent,
	type IncubatorMessage,
	type InitIncubationValues,
} from "@interfaces/incubatorWS";
import type { FormValues as ControlFormValues } from "./components/ControlForm";

export const IncubatorControl = () => {
	const { getWS, status, unmountWS } = useWS({
		url: "ws://192.168.0.2:80/incubator/listen",
		reconnect: true,
	});

	const handleControlFormSubmit = async (values: ControlFormValues) => {
		const ws = await getWS();
		const message: IncubatorMessage<InitIncubationValues> = {
			eventName: IncubatorMessageEvent.INIT_INCUBATION,
			data: {
				roll_intervval: inputParser.timeInputToNumber(values.rollInterval),
				incubation_duration: inputParser.timeInputToNumber(values.incubationDuration),
				min_temperature: inputParser.temperatureInputToNumber(values.minTemperature),
				max_temperature: inputParser.temperatureInputToNumber(values.maxTemperature),
			},
		};
		if (status.value === WSStatus.CONNECTED) {
			ws.send(JSON.stringify(message));
		}
	};

	useEffect(() => {
		const initWS = async () => {
			const ws = await getWS();
			
			ws.onmessage = event => {
				const message: IncubatorMessage<boolean> = JSON.parse(event.data);
				if (message.eventName === IncubatorMessageEvent.CONNECTION) {
					status.setStatus(WSStatus.CONNECTED);
				}
			};
		};

		initWS();
		return () => unmountWS();
	}, []);

	if (status.value === WSStatus.CONNECTING) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	return <ControlForm onSubmit={handleControlFormSubmit}></ControlForm>;
};
