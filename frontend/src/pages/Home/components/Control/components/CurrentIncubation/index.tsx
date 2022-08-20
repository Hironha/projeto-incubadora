import { useEffect } from "react";

import { IncubationData } from "../IncubationData";

import { useWS } from "@hooks/useWS";

import { type IncubatorMessage, IncubatorMessageEvent } from "@interfaces/incubatorWS";
import type { IncubationData as IncubationDataType } from "@interfaces/incubation";

type CurrentIncubationProps = {
	data: IncubationDataType;
	onIncubationFinished: () => void;
};

export const CurrentIncubation = ({ data, onIncubationFinished }: CurrentIncubationProps) => {
	const { getWS, unmountWS } = useWS({
		url: `ws://${import.meta.env.VITE_API_HOSTNAME}/incubator/listen`,
		reconnect: false,
	});

	useEffect(() => {
		const setupWS = async () => {
			const ws = await getWS();
			ws.onmessage = event => {
				const message = JSON.parse(event.data) as IncubatorMessage<any>;
				if (message.eventName === IncubatorMessageEvent.INCUBATION_FINISHED) {
					onIncubationFinished();
				}
			};
		};

		setupWS();
		return () => unmountWS();
	}, []);

	return <IncubationData data={data} />;
};
