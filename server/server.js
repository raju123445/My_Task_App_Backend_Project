const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

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
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://my-task-app-backend-project.vercel.app',
      'https://my-task-app-frontend-project.vercel.app',
      'http://localhost:5173',
      'https://my-task-app-backend-project-9ygdp4tfs.vercel.app/',
      'my-task-app-backend-project-git-main-sharanabasavarajs-projects.vercel.app',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Serve static files from frontend build (if deploying frontend with backend)
const frontendPath = path.join(__dirname, '..', 'Client', 'dist');
try {
  app.use(express.static(frontendPath));
} catch (error) {
  console.log('Frontend build not found - running in API-only mode');
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tasks', taskRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Catch-all route for React Router (must be after all API routes)
// This handles all non-API routes and returns a message for frontend
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

// Catch-all for non-API routes - serve index.html for React Router
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  // Serve frontend index.html for all non-API routes
  const indexPath = path.join(__dirname, '..', 'Client', 'dist', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If frontend not built, send success response
      res.status(200).json({ message: 'Frontend routing handled - use React Router' });
    }
  });
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