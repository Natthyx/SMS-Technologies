import admin from 'firebase-admin';
import serviceAccount from '../smsserviceAccount.json';

// Only initialize if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://smstechnologiescareer.firebaseio.com'
  });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth, admin };