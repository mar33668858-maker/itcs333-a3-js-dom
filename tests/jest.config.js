module.exports = {
  rootDir: '..',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  // Make the student's index.html/app.js resolvable
  moduleFileExtensions: ['js'],
  verbose: false
};
