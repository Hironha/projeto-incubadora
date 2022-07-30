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
	const ws = useRef<WebSocket>(new WebSocket(url));
	const [status, setStatus] = useState<WSStatus>("connected");

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
			newWS.onerror = ws.current.onerror;
			newWS.onopen = ws.current.onopen;
			newWS.onmessage = ws.current.onmessage;
			ws.current = newWS;
			ws.current.onclose = event => reconnectWS(event.reason);
		}, reconnectionInterval);
	}, []);

	useEffect(() => {
		if (reconnect) {
			ws.current.onclose = event => reconnectWS(event.reason);
		}

		return () => ws.current.close(1000, "page_changed");
	}, [reconnect]);

	return {
		ws: ws.current,
		status,
		reconnect: reconnectWS,
	};
};
