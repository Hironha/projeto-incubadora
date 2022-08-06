import { useContext, useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";

import { AuthContext } from "@providers/AuthProvider";

enum WSStatus {
	CONNECTED = "connected",
	CONNECTING = "connecting",
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
	const { token, changeToken, clearToken } = useContext(AuthContext);
	const [status, setStatus] = useState<WSStatus>(WSStatus.CONNECTED);

	const accessTokenProtocol = ["access_token", `${token}`];

	const getWS = () => {
		if (ws.current === null) {
			ws.current = new WebSocket(url, accessTokenProtocol);
		}
		return ws.current;
	};

	const handleConnectionOpen = () => {
		setTimeout(() => {
			if (getWS().readyState === getWS().OPEN) {
				setStatus(WSStatus.CONNECTED);
			}
		}, 6 * 1000);
	};

	const handleMaxReconnections = () => {
		attempts.current = 0;
		setStatus(WSStatus.DISCONNECTED);
	};

	const handleReconnection = () => {
		const newWS = new WebSocket(url, accessTokenProtocol);
		newWS.onerror = getWS().onerror;
		newWS.onopen = getWS().onopen;
		newWS.onmessage = getWS().onmessage;
		newWS.onopen = handleConnectionOpen;
		ws.current = newWS;
		ws.current.onclose = event => reconnectWS(event.reason);
	};

	const handleUnauthorizedReconnection = async () => {
		retryAuth.current = false;
		const user = getAuth().currentUser;
		if (!user) {
			ws.current = null;
			setStatus(WSStatus.UNAUTHORIZED);
			return clearToken();
		}

		const token = await user.getIdToken(true);

		attempts.current = 0;
		changeToken(token);
		handleReconnection();
	};

	const reconnectWS = async (reason?: string) => {
		if (reason === CloseEvents.PAGE_CHANGED) return;

		if (reason === CloseEvents.UNAUTHORIZED && retryAuth.current) {
			return await handleUnauthorizedReconnection();
		}

		if (attempts.current >= reconnectionAttempts) {
			return handleMaxReconnections();
		}

		attempts.current += 1;
		setStatus(WSStatus.CONNECTING);

		setTimeout(() => handleReconnection(), reconnectionInterval);
	};

	useEffect(() => {
		if (reconnect) {
			getWS().onclose = event => reconnectWS(event.reason);
		}

		return () => getWS().close(1000, CloseEvents.PAGE_CHANGED);
	}, [reconnect]);

	return {
		ws: getWS(),
		status,
		reconnect: reconnectWS,
	};
};
