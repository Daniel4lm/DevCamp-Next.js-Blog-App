import { defineConfig } from "cypress";
import resetDB from "./cypress/tasks/resetDB";
import { seedDB } from "./src/lib/db/seed";
//import { loadEnvConfig } from '@next/env'

//console.info('DATABASE_URL ...', process.env.DATABASE_URL)
//const { combinedEnv } = loadEnvConfig(process.cwd());

export default defineConfig({
  projectId: "k27fxq",
  e2e: {
    //baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {

      on('task', {
        resetDB,
        seedDB
      })

      const appVersion = config.env.SITE_URL || 'local'

      const urls: { [key: string]: string } = {
        local: "http://localhost:3000",
        staging: "https://staging.example.com",
        prod: "https://example.com"
      }
      // choosing version from urls object
      config.baseUrl = urls[appVersion as string]

      return config
    },
    //testIsolation: false,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
