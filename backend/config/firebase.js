// config/firebase.js
import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import path from "path";

let serviceAccount;

// 1. Check if the credential is provided as an environment variable (For Render)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT from env:", e);
    }
}
// 2. Fallback to local file (For Local Development)
else {
    const serviceAccountPath = path.resolve("./config/firebase-service-account.json");
    if (existsSync(serviceAccountPath)) {
        serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    } else {
        console.warn("Firebase service account not found locally!");
    }
}

if (serviceAccount && !admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export default admin;
