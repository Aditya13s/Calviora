const mongoose = require('mongoose');
const { validateEnvironment } = require('../utils/validation');

// Validate required environment variables
try {
    validateEnvironment();
} catch (error) {
    console.error('Environment validation failed:', error.message);
    process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

// Mongoose connection options for better production readiness
const mongooseOptions = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
};

mongoose
    .connect(MONGODB_URI, mongooseOptions)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});

module.exports = mongoose.connection;
