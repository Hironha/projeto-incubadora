import { Communicator } from '@utils/communicator';
import { CommunicateIncubatorService } from '@services/communicateIncubator';

import type * as WebSocket from 'ws';
import type { ParsedQs } from 'qs';
import type { NextFunction, Request } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';

export class SendIncubator extends Communicator {
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
		this.incubatorService.addSender(ws);
	}
}
