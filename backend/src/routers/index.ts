import { getRouter as getUserRouter } from './user';
import { getRouter as getIncubatorRouter } from './incubator';
import { RouterFactory } from '@interfaces/utility/router';

export const routerFactories: { [key: string]: RouterFactory } = {
	user: getUserRouter,
	incubator: getIncubatorRouter,
};
