module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['/src/types/', '/src/server.ts'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/types/'],
  roots: ['<rootDir>/src/'],
  moduleDirectories: ['node_modules', 'src'],
};
