// jest.config.js

/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require("next/jest.js");
const createJestConfig = nextJest({ dir: "./" });

const config = {
  projects: [
    {
      displayName: "components",
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
      testMatch: [
        "<rootDir>/components/**/*.test.tsx",
        "<rootDir>/components/**/*.test.jsx",
        "<rootDir>/lib/**/*.test.ts",
        "<rootDir>/lib/**/*.test.js",
      ],
      moduleNameMapper: { "^@/(.*)$": "<rootDir>/$1" },
      transform: {
        "^.+\\.(ts|tsx|js|jsx)$": [
          "@swc/jest",
          {
            jsc: {
              parser: {
                syntax: "ecmascript",
                jsx: true,
              },
              transform: {
                react: { runtime: "automatic" },
              },
            },
          },
        ],
      },
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
    },
  ],
};

module.exports = createJestConfig(config);