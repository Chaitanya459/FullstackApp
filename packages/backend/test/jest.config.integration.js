const path = require('path')

module.exports = {
  displayName: 'integration',
  roots: [path.join(__dirname, '../src')],
  rootDir: path.join(__dirname, '..'),
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/__tests__/*.integration.*'],
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.join(__dirname, '../src'),
  ],
  coverageDirectory: path.join(__dirname, '../coverage'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['.*/__tests__/.*'],
  setupFilesAfterEnv: [require.resolve('./setup-env')],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}
