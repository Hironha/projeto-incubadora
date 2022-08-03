import express, { response } from 'express';
import { handleRequest } from '@utils/controller';
import { CreateUserController } from '@controllers/createUser';

import type { RouterFactory } from '@interfaces/utility/router';

export const getRouter: RouterFactory = () => {
	const router = express.Router({ caseSensitive: true });

	const routes = {
		create: {
			method: 'POST',
			path: '/users/create',
			controller: new CreateUserController(),
		},
	};

	router.post(routes.create.path, handleRequest(routes.create.controller));

	return router;
};
