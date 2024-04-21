/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['dotenv/config'],
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/build/src/$1',
		'^@routes/(.*)$': '<rootDir>/build/src/routes/$1',
		'^@helpers/(.*)$': '<rootDir>/build/src/helpers/$1',
		'^@types/(.*)$': '<rootDir>/build/src/types/$1',
		'^@mongodb/(.*)$': '<rootDir>/build/src/mongodb/$1',
		'^@middleware/(.*)$': '<rootDir>/build/src/middleware/$1'
	}
};
