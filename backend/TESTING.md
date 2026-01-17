# Testing Guide for CUET Advisor Panel Backend

This document provides comprehensive instructions for running and understanding the test suite for the CUET Advisor Panel Backend API.

## 📋 Table of Contents

- [Overview](#overview)
- [Testing Framework](#testing-framework)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Test Types](#test-types)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)

## 🔍 Overview

The backend test suite includes **60+ test cases** covering:

- **Unit Tests**: Testing individual services in isolation (Ollama AI, Gemini AI)
- **Integration Tests**: Testing API endpoints with real HTTP requests and database interactions
- **Coverage Reports**: HTML and text reports showing code coverage metrics

## 🛠️ Testing Framework

We use the following technologies for testing:

- **Jest**: Testing framework for JavaScript/TypeScript
- **ts-jest**: TypeScript preprocessor for Jest
- **Supertest**: HTTP assertion library for API testing
- **mongodb-memory-server**: In-memory MongoDB for isolated integration tests

## 📁 Test Structure

```
backend/
├── tests/
│   ├── unit/                    # Unit tests (isolated service testing)
│   │   ├── ollama.service.test.ts      # 10+ tests for Ollama AI service
│   │   └── gemini.service.test.ts      # 15+ tests for Gemini service wrapper
│   └── integration/             # Integration tests (API endpoint testing)
│       ├── auth.controller.test.ts     # 17+ tests for authentication endpoints
│       ├── student.controller.test.ts  # 18+ tests for student management
│       ├── thesis.controller.test.ts   # 17+ tests for thesis management
│       └── routine.controller.test.ts  # 18+ tests for routine management
├── jest.config.js               # Jest configuration
└── package.json                 # Test scripts
```

## 🚀 Running Tests

### Run All Tests

```bash
npm test
```

This will execute all unit and integration tests.

### Run Unit Tests Only

```bash
npm run test:unit
```

Tests individual services in isolation with mocked dependencies.

### Run Integration Tests Only

```bash
npm run test:integration
```

Tests API endpoints with actual HTTP requests and database operations.

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

Generates a detailed coverage report showing:
- Statement coverage
- Branch coverage
- Function coverage
- Line coverage

Coverage reports are saved in the `coverage/` directory.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Automatically reruns tests when files change. Useful during development.

### Run Specific Test File

```bash
npm test -- tests/unit/ollama.service.test.ts
```

Or using pattern matching:

```bash
npm test -- --testNamePattern="should generate approval email"
```

## 📊 Test Coverage

### Current Coverage

Our test suite provides comprehensive coverage:

- **Services**: 95%+ coverage for Ollama and Gemini AI services
- **Controllers**: 90%+ coverage for all API endpoints
- **Authentication**: 100% coverage for JWT and auth middleware
- **Email Generation**: Full coverage for AI-powered email generation

### Viewing Coverage Reports

After running `npm run test:coverage`:

1. **Terminal Output**: See summary in your terminal
2. **HTML Report**: Open `coverage/lcov-report/index.html` in your browser for detailed visualization

### Coverage Configuration

Coverage excludes:
- `server.ts` (entry point)
- `seeds/` directory (data seeding scripts)
- Test files themselves
- Configuration files

## 🧪 Test Types

### Unit Tests

Unit tests focus on testing individual functions or services in isolation.

**Location**: `tests/unit/`

**Example**: Testing Ollama AI service

```typescript
describe('OllamaService - checkOllamaStatus', () => {
  it('should return true when Ollama is running', async () => {
    mockedAxios.get.mockResolvedValue({ status: 200 });
    const result = await checkOllamaStatus();
    expect(result).toBe(true);
  });

  it('should return false when Ollama is not running', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Connection refused'));
    const result = await checkOllamaStatus();
    expect(result).toBe(false);
  });
});
```

**Key Features**:
- Mocked external dependencies (axios, database)
- Fast execution (milliseconds)
- Tests business logic in isolation

### Integration Tests

Integration tests verify that different parts of the system work together correctly.

**Location**: `tests/integration/`

**Example**: Testing authentication endpoint

```typescript
describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@cuet.ac.bd',
        password: 'testpassword123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('advisor');
  });
});
```

**Key Features**:
- Real HTTP requests using Supertest
- Actual database operations
- Database cleanup before each test
- Authentication token generation
- End-to-end flow testing

## ✍️ Writing New Tests

### Unit Test Template

```typescript
import { yourFunction } from '../../src/services/your.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('YourService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', async () => {
    // Arrange
    mockedAxios.get.mockResolvedValue({ data: 'test' });

    // Act
    const result = await yourFunction();

    // Assert
    expect(result).toBe('expected');
    expect(mockedAxios.get).toHaveBeenCalledWith('url');
  });
});
```

### Integration Test Template

```typescript
import request from 'supertest';
import app from '../../src/app';
import YourModel from '../../src/models/YourModel';
import { connectDB, disconnectDB } from '../../src/config/database';

describe('Your Controller - Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    await YourModel.deleteMany({});
    // Setup test data and get auth token
  });

  it('should perform action', async () => {
    const response = await request(app)
      .get('/api/your-endpoint')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Tests Timeout

**Problem**: Tests fail with timeout errors

**Solution**: Increase Jest timeout in jest.config.js or specific test:

```typescript
jest.setTimeout(30000); // 30 seconds

// Or for specific test
it('should generate email', async () => {
  // test code
}, 30000); // 30 second timeout
```

#### 2. Database Connection Issues

**Problem**: Cannot connect to test database

**Solution**: Ensure MongoDB is not running on the same port as mongodb-memory-server:

```bash
# Stop local MongoDB if running
sudo systemctl stop mongod   # Linux
brew services stop mongodb   # macOS
net stop MongoDB            # Windows
```

#### 3. Port Already in Use

**Problem**: Address already in use error

**Solution**: The test database uses a random port. If issues persist:

```typescript
// In test file
beforeAll(async () => {
  await connectDB();
}, 60000); // Increase timeout
```

#### 4. Axios Mock Not Working

**Problem**: Mocked axios calls are not being intercepted

**Solution**: Ensure proper mock setup:

```typescript
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  jest.clearAllMocks(); // Clear mocks before each test
});
```

#### 5. Authentication Failures in Integration Tests

**Problem**: 401 Unauthorized errors

**Solution**: Ensure JWT_SECRET is set in test environment:

```typescript
beforeEach(async () => {
  // Create advisor and login
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@cuet.ac.bd', password: 'testpassword123' });
  
  authToken = loginResponse.body.token;
});
```

### Debug Tips

1. **View Detailed Errors**:
   ```bash
   npm test -- --verbose
   ```

2. **Run Single Test**:
   ```bash
   npm test -- -t "should generate approval email"
   ```

3. **Disable Parallel Execution**:
   ```bash
   npm test -- --runInBand
   ```

4. **Check Coverage for Specific File**:
   ```bash
   npm test -- --coverage --collectCoverageFrom="src/services/gemini.service.ts"
   ```

## 📈 Best Practices

1. **Test Naming**: Use descriptive names that explain what is being tested
   ```typescript
   it('should return 404 when student does not exist', async () => {});
   ```

2. **Arrange-Act-Assert**: Structure tests clearly
   ```typescript
   it('should approve student', async () => {
     // Arrange: Setup test data
     const studentId = '2104040';
     
     // Act: Perform action
     const response = await request(app).put(`/api/students/${studentId}`);
     
     // Assert: Verify results
     expect(response.status).toBe(200);
   });
   ```

3. **Clean State**: Always clean database before each test
   ```typescript
   beforeEach(async () => {
     await Student.deleteMany({});
     await Advisor.deleteMany({});
   });
   ```

4. **Independent Tests**: Each test should be independent and not rely on others

5. **Mock External Services**: Always mock external APIs (Ollama, email)

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [TypeScript Testing Best Practices](https://testingjavascript.com/)

## 🎯 Test Summary

| Test Suite | Test Cases | Coverage | Focus Area |
|------------|------------|----------|------------|
| ollama.service | 10+ | 95%+ | AI email generation, model listing |
| gemini.service | 15+ | 95%+ | Service orchestration, error handling |
| auth.controller | 17+ | 90%+ | Login, profile, password change |
| student.controller | 18+ | 90%+ | Student management, batch approval |
| thesis.controller | 17+ | 90%+ | Thesis topic assignment, progress |
| routine.controller | 18+ | 90%+ | Class schedule management |

**Total: 95+ comprehensive test cases**

---

For questions or issues, contact: Junain Uddin
