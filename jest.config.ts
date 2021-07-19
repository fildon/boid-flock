import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  clearMocks: true,
};

export default config;
