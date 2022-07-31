import { useCallback, useEffect, useRef, useState } from "react";

type UseWSProps = {
	url: string;
	reconnect?: boolean;
	reconnectionAttempts?: number;
	reconnectionInterval?: number;
};

type WSStatus = "connected" | "connecting" | "disconnected";

export const useWS = (props: UseWSProps) => {
	const {
		url,
		reconnect = true,
		reconnectionAttempts = 3,
		reconnectionInterval = 10 * 1000,
	} = props;
	const attempts = useRef(0);
	const ws = useRef<WebSocket | null>(null);
	const [status, setStatus] = useState<WSStatus>("connected");

	const getWS = () => {
		if (ws.current === null) {
			ws.current = new WebSocket(url);
			return ws.current;
		}
		return ws.current;
	};

	const handleOpenConnection = useCallback(() => {
		setStatus("connected");
		attempts.current = 0;
	}, []);

	const reconnectWS = useCallback((reason?: string) => {
		if (reason === "page_changed") return;
		if (attempts.current >= reconnectionAttempts) {
			attempts.current = 0;
			setStatus("disconnected");
			return;
		}

		attempts.current += 1;
		setStatus("connecting");

		setTimeout(() => {
			const newWS = new WebSocket(url);
			newWS.onerror = getWS().onerror;
			newWS.onopen = getWS().onopen;
			newWS.onmessage = getWS().onmessage;
			newWS.onopen = handleOpenConnection;
			ws.current = newWS;
			ws.current.onclose = event => reconnectWS(event.reason);
		}, reconnectionInterval);
	}, []);

	useEffect(() => {
		if (reconnect) {
			getWS().onclose = event => reconnectWS(event.reason);
		}

		return () => getWS().close(1000, "page_changed");
	}, [reconnect]);

	return {
		ws: getWS(),
		status,
		reconnect: reconnectWS,
	};
};
