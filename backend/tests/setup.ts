/**
 * Global test setup file
 * This runs before all tests and configures the test environment
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Increase test timeout for database operations
jest.setTimeout(30000);

// Suppress console logs during tests (optional - uncomment if you want cleaner output)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
// };
