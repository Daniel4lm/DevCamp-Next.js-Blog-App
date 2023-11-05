const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
    // Add more setup options before each test is run
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    preset: 'ts-jest',
    // automate clear mocks
    clearMocks: true,
    //modulePathIgnorePatterns: ['cypress'],
    moduleNameMapper: {
        //'^@/hooks/api$': '<rootDir>/src/hooks/api',
    },
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
    setupFiles: [
        '<rootDir>/jest.polyfills.js',
    ],
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/", "<rootDir>/cypress/"]
    //transformIgnorePatterns: [],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)
