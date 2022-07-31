import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import certification from './projeto-incubadora.cert.json';

import type { ServiceAccount } from 'firebase-admin';

admin.initializeApp({
	databaseURL: 'https://incubadora.firebaseio.com',
	credential: admin.credential.cert(certification as ServiceAccount),
});

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export { db };
