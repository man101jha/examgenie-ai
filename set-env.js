const fs = require('fs');

// The Vercel Environment Variables
const apiKey = process.env.GEMINI_API_KEY;
const firebaseApiKey = process.env.FIREBASE_API_KEY;
const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN;
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET;
const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID;
const firebaseAppId = process.env.FIREBASE_APP_ID;
const firebaseMeasurementId = process.env.FIREBASE_MEASUREMENT_ID;

const envConfigFile = `
export const environment = {
  production: true,
  geminiApiKey: '${apiKey}',
  firebase: {
    apiKey: "${firebaseApiKey}",
    authDomain: "${firebaseAuthDomain}",
    projectId: "${firebaseProjectId}",
    storageBucket: "${firebaseStorageBucket}",
    messagingSenderId: "${firebaseMessagingSenderId}",
    appId: "${firebaseAppId}",
    measurementId: "${firebaseMeasurementId}"
  }
};
`;

console.log('Injecting Vercel Environment Variables into environment.prod.ts...');

fs.writeFile('./src/environments/environment.prod.ts', envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully injected environment variables!');
  }
});
