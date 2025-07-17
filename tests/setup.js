// Test setup file
require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/calviora_test';
process.env.EXPRESS_SESSION_SECRET = 'test-secret-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3001';
