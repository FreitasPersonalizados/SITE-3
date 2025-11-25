// setAdmin.js (run locally, requires firebase-admin and serviceAccountKey.json)
// npm install firebase-admin
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const uid = process.argv[2];
if(!uid){ console.log('Usage: node setAdmin.js <USER_UID>'); process.exit(1); }
admin.auth().setCustomUserClaims(uid, { admin: true }).then(()=> console.log('done')).catch(e=>console.error(e));
