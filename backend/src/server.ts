import express from 'express';
import dotenv from 'dotenv';
import enableWS from 'express-ws';
import helmet from 'helmet';

import { logAvailableRoutes } from '@utils/routes';
import { routerFactories } from './routers';

import type { Router } from 'express';

dotenv.config();

const app = express();
enableWS(app);

const port = process.env.PORT ? parseInt(process.env.PORT) : 80;
const isDev = process.env.NODE_ENV === 'dev';
const hostname: string = process.env.HOSTNAME || 'localhost';

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
