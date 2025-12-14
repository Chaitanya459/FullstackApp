const path = require('path')

module.exports = {
  displayName: 'unit',
  roots: [path.join(__dirname, '../src')],
  rootDir: path.join(__dirname, '..'),
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/*.spec.ts'],
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.join(__dirname, '../src'),
  ],
  coverageDirectory: path.join(__dirname, '../coverage-exercises'),
  coveragePathIgnorePatterns: ['.*/__tests__/.*', '**/*.spec.ts'],
  setupFilesAfterEnv: [require.resolve('./setup-env')],
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
}
