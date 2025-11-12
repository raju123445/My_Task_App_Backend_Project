const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

require('dotenv').config();

const { logger, errorLogger, logPerformance } = require('./utils/logger');
const errorHandler = require('./middleware/errorMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Security middleware
app.use(helmet()); // Set security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Logging middleware
app.use(logger);

// Performance tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logPerformance(`${req.method} ${req.url}`, duration, res.statusCode);
  });
  next();
});

// CORS configuration to allow Vercel frontend
app.use(cors({
  origin: [
    'https://my-task-app-backend-project.vercel.app',
    'https://my-task-app-frontend-project.vercel.app', // If you deploy frontend here
    'http://localhost:5173', // For local development
  ],
  credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tasks', taskRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });