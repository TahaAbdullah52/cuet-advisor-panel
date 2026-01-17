import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

/**
 * Connect to in-memory MongoDB for testing
 * This creates a completely isolated test database that doesn't affect production
 */
export const connectTestDB = async (): Promise<void> => {
  try {
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory database
    await mongoose.connect(mongoUri);

    console.log('✅ Test MongoDB connected (in-memory)');
    console.log(`📊 Test Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ Test MongoDB connection failed:', error);
    throw error;
  }
};

/**
 * Disconnect from test database and stop the in-memory server
 */
export const disconnectTestDB = async (): Promise<void> => {
  try {
    // Close mongoose connection
    await mongoose.disconnect();

    // Stop in-memory MongoDB server
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }

    console.log('✅ Test MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting test database:', error);
    throw error;
  }
};

/**
 * Clear all collections in the test database
 * Use this in beforeEach() to ensure clean state for each test
 */
export const clearTestDB = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log('🧹 Test database cleared');
  } catch (error) {
    console.error('❌ Error clearing test database:', error);
    throw error;
  }
};

/**
 * Drop all collections in the test database
 * More thorough than clearTestDB - removes indexes too
 */
export const dropTestDB = async (): Promise<void> => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.drop();
    }

    console.log('🗑️  Test database dropped');
  } catch (error) {
    // Ignore "ns not found" errors (collection doesn't exist)
    if (error instanceof Error && !error.message.includes('ns not found')) {
      console.error('❌ Error dropping test database:', error);
      throw error;
    }
  }
};
