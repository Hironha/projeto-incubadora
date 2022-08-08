import { useEffect } from "react";
import { useWS, WSStatus } from "@hooks/useWS";

import { Loading } from "@components/Loading";
import { ControlForm } from "./components";
import { LoadingContainer } from "./styles";

import type { FormValues as ControlFormValues } from "./components/ControlForm";
import { IncubatorMessageEvent, type IncubatorMessage } from "@interfaces/incubatorWS";

export const IncubatorControl = () => {
	const { getWS, reconnect, status, unmountWS } = useWS({
		url: "ws://192.168.0.2:80/incubator/listen",
		reconnect: true,
	});

	const handleControlFormSubmit = async (values: ControlFormValues) => {
		const ws = await getWS();
		const message: IncubatorMessage<ControlFormValues> = {
			eventName: IncubatorMessageEvent.INIT_INCUBATION,
			data: values,
		};
		ws.send(JSON.stringify(message));
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
