import type { NextFunction, Request, Response } from 'express';

export abstract class Controller {
	public abstract handleRequest(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void>;

	public handleMiddleware(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> | void {}
}

export const handleRequest = (controller: Controller) => {
	return (req: Request, res: Response, next: NextFunction) => {
		controller.handleRequest(req, res, next);
	};
};

export const handleMiddleware = (controller: Controller) => {
	return (req: Request, res: Response, next: NextFunction) => {
		controller.handleMiddleware(req, res, next);
	};
};
