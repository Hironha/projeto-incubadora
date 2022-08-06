import { Communicator } from '@utils/communicator';
import { getAuth } from 'firebase-admin/auth';
import { CommunicateIncubatorService } from '@services/communicateIncubator';

import { ConnectionCloseEvent } from '@interfaces/utility/connection';

import type * as WebSocket from 'ws';
import type { ParsedQs } from 'qs';
import type { NextFunction, Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export class ListenIncubator extends Communicator {
	constructor(
		private incubatorService: CommunicateIncubatorService = new CommunicateIncubatorService()
	) {
		super();
	}

	public async handleRequest(
		ws: WebSocket,
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		this.incubatorService.addListener(ws);
	}

	public async handleMiddleware(
		ws: WebSocket,
		req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		next: NextFunction
	): Promise<void> {
		try {
			const token = (req.headers['sec-websocket-protocol'] as string)
				.split(', ')
				.at(1);
			if (!token) throw new Error();

			const auth = getAuth();
			await auth.verifyIdToken(token);
			next();
		} catch (err) {
			console.log('user unauthorized');
			ws.close(1000, ConnectionCloseEvent.UNAUTHORIZED);
		}
	}
}
