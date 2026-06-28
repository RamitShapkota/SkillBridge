export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/controllers/**/*.js",
    "src/middlewares/**/*.js",
    "src/models/**/*.js",
    "src/utils/**/*.js",
    "!src/utils/createAdmin.js",
    "!src/utils/cloudinary.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
