import { useEffect, useRef } from "react";

type UseWSProps = {
	url: string;
	reconnect?: boolean;
	reconnectionAttempts?: number;
	reconnectionInterval?: number;
};

export const useWS = (props: UseWSProps): [WebSocket] => {
	const {
		url,
		reconnect = true,
		reconnectionAttempts = 3,
		reconnectionInterval = 15 * 1000,
	} = props;

	const ws = useRef<WebSocket>(new WebSocket(url));

	const reconnectWS = (reason: string, attemptsAmount = 0) => {
		if (attemptsAmount === reconnectionAttempts || reason !== "page_changed") return;

		setTimeout(() => {
			ws.current = new WebSocket(url);
			ws.current.onclose = () => reconnectWS(reason, attemptsAmount + 1);
		}, reconnectionInterval);
	};

	useEffect(() => {
		if (reconnect) {
			ws.current.onclose = event => reconnectWS(event.reason);
		}

		return () => ws.current.close(1000, "page_changed");
	}, [reconnect]);

	return [ws.current];
};
