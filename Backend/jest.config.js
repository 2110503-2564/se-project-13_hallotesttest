module.exports = {
    testEnvironment : 'node',
    testTimeout : 60000,
    verbose : true,
    testMatch : ['**/tests/**/*.test.js'],
    setupFilesAfterEnv : ['./jest.setup.js']
};