module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
    '^@auth/(.*)$': '<rootDir>/src/modules/auth/$1'
  }
};