import express from 'express';
import { CommunicateIncubatorService } from '@services/communicateIncubator';
import { ListenIncubator } from '@communicators/listenIncubator';
import { SendIncubator } from '@communicators/sendIncubator';
import { handleRequest, handleMiddleware } from '@utils/communicator';

import type { RouterFactory } from '@interfaces/utility/router';

export const getRouter: RouterFactory = () => {
	const router = express.Router({ caseSensitive: true });
	const communicateIncubatorService = new CommunicateIncubatorService();
	const listenIncubator = new ListenIncubator(communicateIncubatorService);

	router.ws(
		'/incubator/listen',
		handleMiddleware(listenIncubator),
		handleRequest(listenIncubator)
	);
	router.ws(
		'/incubator/send',
		handleRequest(new SendIncubator(communicateIncubatorService))
	);

	return router;
};
