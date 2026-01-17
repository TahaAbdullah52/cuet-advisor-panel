# Test Database Configuration

## Overview

This project uses **mongodb-memory-server** for testing, which creates an **in-memory MongoDB database** that is completely isolated from your production database.

## How It Works

### Production Database

- **Location:** MongoDB Atlas (cloud)
- **Connection:** Uses `MONGODB_URI` from `.env`
- **Used by:** Development server, production server
- **Data:** Real application data

### Test Database

- **Location:** In-memory (RAM)
- **Connection:** Automatically created by `mongodb-memory-server`
- **Used by:** Jest tests only
- **Data:** Temporary test data (deleted after tests)

## Key Features

✅ **Completely Isolated** - Tests never touch production database
✅ **Fast** - In-memory database is much faster than network calls
✅ **Clean State** - Each test starts with a fresh database
✅ **No Setup Required** - Database is created automatically
✅ **No Cleanup Required** - Database is destroyed after tests

## File Structure

```
backend/
├── src/
│   └── config/
│       ├── database.ts          # Production database config
│       └── database.test.ts     # Test database config (NEW)
└── tests/
    ├── setup.ts                 # Global test setup (NEW)
    ├── unit/                    # Unit tests
    │   ├── ollama.service.test.ts
    │   └── gemini.service.test.ts
    └── integration/             # Integration tests
        ├── auth.controller.test.ts
        ├── student.controller.test.ts
        ├── routine.controller.test.ts
        └── thesis.controller.test.ts
```

## How Tests Use the Database

### Before All Tests (beforeAll)

```typescript
beforeAll(async () => {
  await connectTestDB(); // Creates in-memory MongoDB
});
```

### Before Each Test (beforeEach)

```typescript
beforeEach(async () => {
  await clearTestDB(); // Clears all data for clean state
  // Create test data...
});
```

### After All Tests (afterAll)

```typescript
afterAll(async () => {
  await disconnectTestDB(); // Stops in-memory MongoDB
});
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Unit Tests Only

```bash
npm run test:unit
```

### Run Integration Tests Only

```bash
npm run test:integration
```

### Run with Coverage

```bash
npm run test:coverage
```

## What Changed

### ✅ Added Files

1. `src/config/database.test.ts` - Test database configuration
2. `tests/setup.ts` - Global test setup
3. `tests/README.md` - This file

### ✅ Updated Files

1. `jest.config.js` - Added setup file
2. `tests/integration/auth.controller.test.ts` - Uses test DB
3. `tests/integration/student.controller.test.ts` - Uses test DB
4. `tests/integration/routine.controller.test.ts` - Uses test DB
5. `tests/integration/thesis.controller.test.ts` - Uses test DB

### ❌ NOT Changed

- Production database configuration (`src/config/database.ts`)
- Production `.env` file
- Any production code
- MongoDB Atlas database

## Verification

To verify tests are using the in-memory database:

1. Run tests:

```bash
npm test
```

2. Check the output - you should see:

```
✅ Test MongoDB connected (in-memory)
📊 Test Database: test
```

3. Check your MongoDB Atlas dashboard - no test data should appear there

## Benefits

### Before (Using Production DB)

- ❌ Tests polluted production database
- ❌ Duplicate key errors
- ❌ Tests depended on existing data
- ❌ Slow (network calls to MongoDB Atlas)
- ❌ Risk of deleting production data

### After (Using In-Memory DB)

- ✅ Tests completely isolated
- ✅ No duplicate key errors
- ✅ Each test has clean state
- ✅ Fast (in-memory operations)
- ✅ Zero risk to production data

## Troubleshooting

### Issue: Tests still connecting to production DB

**Solution:** Make sure you're using the updated test files. Check that imports use:

```typescript
import { connectTestDB, disconnectTestDB, clearTestDB } from '../../src/config/database.test';
```

### Issue: mongodb-memory-server not installed

**Solution:** It should already be installed. If not:

```bash
npm install --save-dev mongodb-memory-server
```

### Issue: Tests timeout

**Solution:** Increase timeout in `jest.config.js`:

```javascript
testTimeout: 60000, // 60 seconds
```

### Issue: Port already in use

**Solution:** mongodb-memory-server uses random ports, so this shouldn't happen. If it does, restart your terminal.

## Important Notes

⚠️ **Production Database is NEVER Touched**

- Tests use a completely separate in-memory database
- Your MongoDB Atlas database remains untouched
- No test data will ever appear in production

✅ **Safe to Run Anytime**

- Run tests as many times as you want
- No cleanup needed
- No risk to production data

🚀 **Fast and Reliable**

- In-memory database is much faster
- No network latency
- Consistent test results

## Questions?

If you have questions about the test setup:

1. Check this README
2. Look at `src/config/database.test.ts`
3. Look at any integration test file for examples

---

**Created:** January 17, 2025
**Author:** Junain Uddin
**Purpose:** Isolate test database from production
