import type * as WebSocket from 'ws';
import type { NextFunction, Request } from 'express';

export abstract class Communicator {
	public abstract handleRequest(
		ws: WebSocket,
		req: Request,
		next: NextFunction
	): Promise<void>;

	public handleMiddleware(
		ws: WebSocket,
		req: Request,
		next: NextFunction
	): Promise<void> | void {}
}

export const handleRequest = (communicator: Communicator) => {
	return (ws: WebSocket, res: Request, next: NextFunction) => {
		communicator.handleRequest(ws, res, next);
	};
};

export const handleMiddleware = (communicator: Communicator) => {
	return (ws: WebSocket, res: Request, next: NextFunction) => {
		communicator.handleMiddleware(ws, res, next);
	};
};
