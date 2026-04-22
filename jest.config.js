// jest.config.js

/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest.js")
const createJestConfig = nextJest({ dir: "./" })

const config = {

  // Fichiers inclus dans le calcul — uniquement la logique métier
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "app/api/**/*.ts",
    // Exclusions — fichiers de test et fichiers sans logique métier
    "!**/*.test.{ts,tsx}",
    "!**/__tests__/**",
    "!**/node_modules/**",
    "!**/*.d.ts",
    "!lib/db/schema.ts",        // initialisation des tables, pas de logique métier
    "!lib/db/client.ts",        // configuration de connexion uniquement
    "!components/movies/MoviesClient.tsx", // orchestrateur UI, couvert manuellement
  ],

  coverageProvider: "v8",

  // Formats de rapport générés
  coverageReporters: ["text", "lcov", "html", "cobertura"],

  // Seuils bloquants — Jest retourne un code d'erreur si non atteints,
  // ce qui fait échouer le pipeline CI
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 85,
      statements: 85,
    },
  },

  // Windows : forcer le worker pool en mode "workerThreads" pour éviter
  // les problèmes de spawn de processus enfants (ENOMEM / EPERM)
  workerThreads: true,

  projects: [
    {
      displayName: "components",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      testMatch: [
        // Double-slash accepté par Jest sur Windows via micromatch
        "<rootDir>/components/**/*.test.tsx",
        "<rootDir>/lib/**/*.test.ts",
      ],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
          "@swc/jest",
          { jsc: { transform: { react: { runtime: "automatic" } } } },
        ],
      },
      // Windows : certains antivirus verrouillent les fichiers temporaires ;
      // on augmente le délai d'attente par défaut
      testTimeout: 30000,
    },
    {
      displayName: "api",
      testEnvironment: "node",
      testMatch: [
        "<rootDir>/app/api/**/*.test.ts",
      ],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      transform: {
        "^.+\\.(ts|tsx|js|jsx)$": ["@swc/jest"],
      },
      testTimeout: 30000,
    },
  ],
}

module.exports = createJestConfig(config)
