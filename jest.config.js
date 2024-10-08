module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  injectGlobals: true,
  verbose: true,
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: './tsconfig.json' }
    ],
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.ts',
    '!**/test/**/*.ts',
  ],
  testMatch: ['**/test/**/*.(test|spec).ts'],
  setupFiles: ['<rootDir>/src/test/setEnvVars.js'],
};
