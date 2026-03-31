const fs = require('fs');

// The Vercel Environment Variable
const apiKey = process.env.GEMINI_API_KEY || 'MISSING_API_KEY';

const envConfigFile = `
export const environment = {
  production: true,
  geminiApiKey: '${apiKey}'
};
`;

console.log('Injecting Vercel Environment Variable into environment.ts...');

fs.writeFile('./src/environments/environment.ts', envConfigFile, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Successfully injected API Key!');
  }
});
