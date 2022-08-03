import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import certification from './projeto-incubadora.cert.json';

import type { ServiceAccount } from 'firebase-admin';

const app = admin.initializeApp({
	databaseURL: 'https://incubadora.firebaseio.com',
	serviceAccountId: (certification as ServiceAccount).clientEmail,
	credential: admin.credential.cert(certification as ServiceAccount),
});

const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

const auth = getAuth(app);

export { db, auth };
