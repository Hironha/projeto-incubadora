import express from 'express';
import enableWS from 'express-ws';

import { logAvailableRoutes } from '@utils/routes';
import { getRouter } from './routers';

import type { Router } from 'express';

const app = express();
const expressWS = enableWS(app);

const port = 80;
const isDev = process.env.NODE_ENV === 'dev';
const hostname: string = '192.168.0.2';

const routers: Router[] = [getRouter()];

routers.forEach((router) => {
	expressWS.app.use(router);
});

app.listen(port, hostname, () => {
	if (isDev) logAvailableRoutes(routers, `${hostname}:${port}`);
	console.log(`Server started on port ${port}`);
});
