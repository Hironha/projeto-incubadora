import express from 'express';
import { CommunicateIncubatorService } from '@services/communicateIncubator';
import { ListenIncubator } from '@communicators/listenIncubator';
import { SendIncubator } from '@communicators/sendIncubator';
import { handleRequest, handleMiddleware } from '@utils/communicator';
import { handleRequest as handleControllerRequest } from '@utils/controller';

import type { RouterFactory } from '@interfaces/utility/router';
import { GetIncubationDataController } from '@controllers/getIncubationData';

export const getRouter: RouterFactory = () => {
	const router = express.Router({ caseSensitive: true });
	const communicateIncubatorService = new CommunicateIncubatorService();
	const listenIncubator = new ListenIncubator(communicateIncubatorService);

	router.ws('/incubator/listen', handleMiddleware(listenIncubator), handleRequest(listenIncubator));
	router.ws('/incubator/send', handleRequest(new SendIncubator(communicateIncubatorService)));

	router.get('/incubator/incubations', handleControllerRequest(new GetIncubationDataController()));

	return router;
};
