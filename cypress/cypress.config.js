import { defineConfig } from 'cypress';
import dotEnv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { resolve } from 'path';

// Load environment variables from .env file
const myEnv = dotEnv.config({
  path: resolve(__dirname, '.env'),
});
dotenvExpand.expand(myEnv);

// Use BASE_URL from environment variables
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  projectId: 'mia7y1',
  env: {
    baseUrl,
    CYPRESS_RECORD_KEY: "ca20e14e-a692-425f-81c5-406473bf4f71"
  },
  e2e: {
    baseUrl,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: false
  },
});
