const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;


const connectDB = async () => {
    try {
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined. Check your .env file.");
        }
        await mongoose.connect(mongoURI);

        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

connectDB();