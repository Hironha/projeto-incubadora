import { getAuth } from 'firebase-admin/auth';

import type { Request, Response, NextFunction } from 'express';

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = (req.headers['Authorization'] as string).split(', ').at(1);
		if (!token) throw new Error();

		const auth = getAuth();
		await auth.verifyIdToken(token, true);
		next();
	} catch (err) {
		res.status(401).end();
	}
};
