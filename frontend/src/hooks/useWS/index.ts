import { useCallback, useContext, useRef, useState } from "react";

import { AuthContext } from "@providers/AuthProvider";

export enum WSStatus {
	CONNECTED = "connected",
	CONNECTING = "connecting",
	RECONNECTING = "reconnecting",
	DISCONNECTED = "disconnected",
	UNAUTHORIZED = "unauthorized",
}

enum CloseEvents {
	PAGE_CHANGED = "page_changed",
	UNAUTHORIZED = "unauthorized",
}

type UseWSProps = {
	url: string;
	reconnect?: boolean;
	reconnectionAttempts?: number;
	reconnectionInterval?: number;
};

export const useWS = (props: UseWSProps) => {
	const {
		url,
		reconnect = true,
		reconnectionAttempts = 3,
		reconnectionInterval = 5 * 1000,
	} = props;
	const attempts = useRef(0);
	const ws = useRef<WebSocket | null>(null);
	const retryAuth = useRef(true);
	const { getToken, verifyAuthentication } = useContext(AuthContext);
	const [status, setStatus] = useState<WSStatus>(WSStatus.CONNECTING);

	const getAccessTokenProtocol = async () => {
		const token = await getToken();
		return ["access_token", `${token}`];
	};

	const getWS = useCallback(async () => {
		if (ws.current === null) {
			ws.current = new WebSocket(url, await getAccessTokenProtocol());
			if (reconnect) {
				ws.current.onclose = event => reconnectWS(event.reason);
			}
		}
		return ws.current;
	}, [reconnect]);

	const unmountWS = useCallback(() => {
		ws.current && ws.current.close(1000, CloseEvents.PAGE_CHANGED);
	}, []);

	const handleMaxReconnections = () => {
		attempts.current = 0;
		setStatus(WSStatus.DISCONNECTED);
	};

	const handleUnauthorizedReconnection = async () => {
		retryAuth.current = false;
		const isAuthenticated = verifyAuthentication();

		if (!isAuthenticated) {
			ws.current = null;
			setStatus(WSStatus.UNAUTHORIZED);
			return;
		}

		attempts.current = 0;
		await handleReconnection();
	};

	const handleReconnection = async () => {
		const newWS = new WebSocket(url, await getAccessTokenProtocol());
		const currWS = await getWS();
		newWS.onerror = currWS.onerror;
		newWS.onopen = currWS.onopen;
		newWS.onmessage = currWS.onmessage;
		newWS.onopen = currWS.onopen;
		ws.current = newWS;
		ws.current.onclose = event => reconnectWS(event.reason);
	};

	const reconnectWS = useCallback(async (reason?: string) => {
		if (reason === CloseEvents.PAGE_CHANGED) return;

		if (reason === CloseEvents.UNAUTHORIZED && retryAuth.current) {
			return await handleUnauthorizedReconnection();
		}

		if (attempts.current >= reconnectionAttempts) {
			return handleMaxReconnections();
		}

		attempts.current += 1;
		setStatus(WSStatus.RECONNECTING);

		setTimeout(() => handleReconnection(), reconnectionInterval);
	}, []);

	return {
		getWS,
		unmountWS,
		status: {
			value: status,
			setStatus,
		},
		reconnect: reconnectWS,
	};
};
