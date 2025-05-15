import admin from "firebase-admin";

if (!admin.apps.length) {
  const base64Key = process.env.FIREBASE_ADMIN_KEY_BASE64 || "";
  const decoded = Buffer.from(base64Key, "base64").toString("utf-8");
  const serviceAccount = JSON.parse(decoded);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { db };
