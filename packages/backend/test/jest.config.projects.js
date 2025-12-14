const path = require(`path`);

module.exports = {
  roots: [ path.join(__dirname, `../src`) ],
  rootDir: path.join(__dirname, `..`),
  testEnvironment: `node`,
  preset: `ts-jest`,
  testMatch: [ `**/__tests__/**` ],
  moduleDirectories: [
    `node_modules`,
    __dirname,
    path.join(__dirname, `../src`),
  ],
  transformIgnorePatterns: [
    `node_modules/(?!(axios))`,
  ],
  coverageDirectory: path.join(__dirname, `../coverage/collective`),
  collectCoverageFrom: [ `**/src/**/*.js` ],
  coveragePathIgnorePatterns: [ `.*/__tests__/.*` ],
  projects: [
    require.resolve(`./jest.config.unit`),
    require.resolve(`./jest.config.integration`),
  ],
  watchPlugins: [
    require.resolve(`jest-watch-select-projects`),
    require.resolve(`jest-watch-typeahead/filename`),
    require.resolve(`jest-watch-typeahead/testname`),
  ],
};
