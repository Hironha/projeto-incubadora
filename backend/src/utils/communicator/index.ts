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
	return async (ws: WebSocket, res: Request, next: NextFunction) => {
		communicator.handleRequest(ws, res, next);
	};
};

export const handleMiddleware = (communicator: Communicator) => {
	return async (ws: WebSocket, req: Request, next: NextFunction) => {
		communicator.handleMiddleware(ws, req, next);
	};
};

export const handleAuthorization = async (
	ws: WebSocket,
	req: Request,
	next: NextFunction
) => {
	console.log(req.headers['sec-websocket-protocol']);
};
