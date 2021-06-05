const {defaults} = require('jest-config');

module.exports = {
    testEnvironment: 'node',
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    testMatch: ['**/?(*.)+(spec|test).+(ts|tsx|js)'],
    roots: ['<rootDir>'],
    modulePaths: ['<rootDir>'],
    moduleDirectories: ['node_modules'],
    coverageProvider: 'v8',
};
