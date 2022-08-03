import express from 'express';
import { CommunicateIncubatorService } from '@services/communicateIncubator';
import { ListenIncubator } from '@communicators/listenIncubator';
import { SendIncubator } from '@communicators/sendIncubator';
import { handleRequest as handleCommunicatorRequest } from '@utils/communicator';

import type { RouterFactory } from '@interfaces/utility/router';

export const getRouter: RouterFactory = () => {
	const router = express.Router({ caseSensitive: true });
	const communicateIncubatorService = new CommunicateIncubatorService();

	router.ws(
		'/incubator/listen',
		handleCommunicatorRequest(new ListenIncubator(communicateIncubatorService))
	);
	router.ws(
		'/incubator/send',
		handleCommunicatorRequest(new SendIncubator(communicateIncubatorService))
	);

	return router;
};
