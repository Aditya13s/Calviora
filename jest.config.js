module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        '**/*.js',
        '!node_modules/**',
        '!coverage/**',
        '!tests/**',
        '!.eslintrc.js',
        '!jest.config.js',
    ],
    testMatch: [
        '**/tests/**/*.test.js',
        '**/tests/**/*.spec.js',
    ],
    verbose: true,
    forceExit: true,
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
};