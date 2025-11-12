const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log events to file
 * @param {string} message - Log message
 * @param {string} logFileName - File name to log to
 * @param {string} logLevel - Log level (INFO, ERROR, WARN, DEBUG)
 */
const logEvents = (message, logFileName, logLevel = 'INFO') => {
  const dateTime = new Date().toISOString();
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const logItem = `[${timestamp}] [${logLevel}] ${message}\n`;
  
  try {
    fs.appendFileSync(path.join(logsDir, logFileName), logItem);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

/**
 * Request logging middleware
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const logMessage = `${req.method}\t${req.url}\t${req.headers.origin || 'No Origin'}`;
  logEvents(logMessage, 'reqLog.txt', 'HTTP');
  
  // Log API requests
  if (req.url.startsWith('/api/')) {
    const apiLog = `${req.method} ${req.url} - IP: ${req.ip || req.connection.remoteAddress}`;
    logEvents(apiLog, 'apiLog.txt', 'API');
  }
  
  // Log auth requests
  if (req.url.includes('/auth')) {
    const authLog = `AUTH: ${req.method} ${req.url}`;
    logEvents(authLog, 'authLog.txt', 'AUTH');
  }
  
  // Log task requests
  if (req.url.includes('/tasks')) {
    const taskLog = `TASK: ${req.method} ${req.url}`;
    logEvents(taskLog, 'taskLog.txt', 'TASK');
  }
  
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};

/**
 * Error logging middleware
 */
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-minute',
    second: '2-digit',
    hour12: false
  });
  
  const errorLog = `ERROR: ${err.message} | Route: ${req.method} ${req.url} | Stack: ${err.stack}`;
  logEvents(errorLog, 'errorLog.txt', 'ERROR');
  
  console.error(`[${timestamp}] ERROR:`, err.message);
  next(err);
};

/**
 * Database operation logging
 */
const logDatabaseOperation = (operation, model, details, status = 'SUCCESS') => {
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const dbLog = `[${timestamp}] [${status}] ${operation} on ${model}: ${JSON.stringify(details)}`;
  logEvents(dbLog, 'dbLog.txt', 'DATABASE');
};

/**
 * User activity logging
 */
const logUserActivity = (userId, action, details) => {
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const activityLog = `USER: ${userId || 'UNKNOWN'} | Action: ${action} | Details: ${JSON.stringify(details)}`;
  logEvents(activityLog, 'activityLog.txt', 'ACTIVITY');
};

/**
 * Performance logging
 */
const logPerformance = (endpoint, duration, statusCode) => {
  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const perfLog = `${endpoint} | Duration: ${duration}ms | Status: ${statusCode}`;
  logEvents(perfLog, 'performanceLog.txt', 'PERF');
};

module.exports = {
  logger,
  errorLogger,
  logEvents,
  logDatabaseOperation,
  logUserActivity,
  logPerformance
};