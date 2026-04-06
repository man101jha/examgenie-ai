const fs = require('fs');

// The Vercel Environment Variables
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBD2GZfnVLClgpD3HhOjtLTr6Wdzqog438';
const firebaseApiKey = process.env.FIREBASE_API_KEY || 'AIzaSyAsdjyt9vHQ7K7qB4Luiur_KEcBtrla5bs';
const firebaseAuthDomain = process.env.FIREBASE_AUTH_DOMAIN || 'examgenie-bd9e6.firebaseapp.com';
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || 'examgenie-bd9e6';
const firebaseStorageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'examgenie-bd9e6.firebasestorage.app';
const firebaseMessagingSenderId = process.env.FIREBASE_MESSAGING_SENDER_ID || '306256796000';
const firebaseAppId = process.env.FIREBASE_APP_ID || '1:306256796000:web:d12c994e9d1295eec8e605';
const firebaseMeasurementId = process.env.FIREBASE_MEASUREMENT_ID || 'G-LMBC07F39J';

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

console.log('Injecting Vercel Environment Variables into environment.ts...');

fs.writeFile('./src/environments/environment.ts', envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully injected environment variables!');
  }
});
