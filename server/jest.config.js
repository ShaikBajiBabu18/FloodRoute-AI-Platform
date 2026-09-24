module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@floodroute/shared$': '<rootDir>/../packages/shared/src',
  },
  verbose: true,
};
