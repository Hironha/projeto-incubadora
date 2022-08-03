import express from 'express';
import enableWS from 'express-ws';
import helmet from 'helmet';

import { logAvailableRoutes } from '@utils/routes';
import { routerFactories } from './routers';

import type { Router } from 'express';

const app = express();
enableWS(app);

const port = 80;
const isDev = process.env.NODE_ENV === 'dev';
const hostname: string = '192.168.0.2';

app.use(helmet());

const routers: Router[] = Object.values(routerFactories).map((factory) =>
	factory()
);

routers.forEach((router) => {
	app.use(router);
});

app.listen(port, hostname, () => {
	if (isDev) logAvailableRoutes(routers, `${hostname}:${port}`);
	console.log(`Server started on port ${port}`);
});
