/**
 * Client-side logging utility
 * Logs to browser console and localStorage for persistence
 */

const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

const MAX_LOGS = 500; // Max logs to keep in localStorage

/**
 * Get formatted timestamp
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Log to localStorage
 */
const logToStorage = (level, message, data = null) => {
  try {
    const timestamp = getTimestamp();
    const logEntry = {
      timestamp,
      level,
      message,
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Get existing logs
    let logs = JSON.parse(localStorage.getItem('appLogs') || '[]');

    // Add new log
    logs.push(logEntry);

    // Keep only last MAX_LOGS entries
    if (logs.length > MAX_LOGS) {
      logs = logs.slice(-MAX_LOGS);
    }

    localStorage.setItem('appLogs', JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
  }
};

/**
 * Format console output
 */
const formatConsoleOutput = (level, message, data) => {
  const timestamp = getTimestamp();
  const styles = {
    DEBUG: 'color: #gray; font-weight: bold;',
    INFO: 'color: #0066cc; font-weight: bold;',
    WARN: 'color: #ff9900; font-weight: bold;',
    ERROR: 'color: #cc0000; font-weight: bold;'
  };

  const style = styles[level] || styles.INFO;
  const prefix = `%c[${timestamp}] [${level}]`;

  if (data) {
    console.log(prefix, style, message, data);
  } else {
    console.log(prefix, style, message);
  }
};

/**
 * Log debug message
 */
const debug = (message, data = null) => {
  if (import.meta.env.DEV) {
    formatConsoleOutput(LOG_LEVELS.DEBUG, message, data);
    logToStorage(LOG_LEVELS.DEBUG, message, data);
  }
};

/**
 * Log info message
 */
const info = (message, data = null) => {
  formatConsoleOutput(LOG_LEVELS.INFO, message, data);
  logToStorage(LOG_LEVELS.INFO, message, data);
};

/**
 * Log warning message
 */
const warn = (message, data = null) => {
  formatConsoleOutput(LOG_LEVELS.WARN, message, data);
  logToStorage(LOG_LEVELS.WARN, message, data);
};

/**
 * Log error message
 */
const error = (message, data = null) => {
  formatConsoleOutput(LOG_LEVELS.ERROR, message, data);
  logToStorage(LOG_LEVELS.ERROR, message, data);
};

/**
 * Log API request
 */
const logApiRequest = (method, url, data = null) => {
  const message = `API ${method} ${url}`;
  info(message, data);
};

/**
 * Log API response
 */
const logApiResponse = (method, url, status, data = null) => {
  const message = `API Response: ${method} ${url} - Status: ${status}`;
  info(message, data);
};

/**
 * Log user action
 */
const logUserAction = (action, details = null) => {
  const message = `USER ACTION: ${action}`;
  info(message, details);
};

/**
 * Log page navigation
 */
const logPageNavigation = (from, to) => {
  const message = `NAVIGATION: ${from} → ${to}`;
  info(message, { from, to });
};

/**
 * Log component lifecycle
 */
const logComponentLifecycle = (componentName, event) => {
  const message = `COMPONENT [${componentName}]: ${event}`;
  debug(message);
};

/**
 * Log form submission
 */
const logFormSubmission = (formName, formData) => {
  const message = `FORM SUBMITTED: ${formName}`;
  info(message, formData);
};

/**
 * Get all logs
 */
const getLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('appLogs') || '[]');
  } catch (error) {
    console.error('Failed to retrieve logs:', error);
    return [];
  }
};

/**
 * Get logs filtered by level
 */
const getLogsByLevel = (level) => {
  const logs = getLogs();
  return logs.filter(log => log.level === level);
};

/**
 * Get logs filtered by message
 */
const getLogsByMessage = (searchTerm) => {
  const logs = getLogs();
  return logs.filter(log => log.message.includes(searchTerm));
};

/**
 * Export logs as text
 */
const exportLogs = (filename = 'app-logs.txt') => {
  const logs = getLogs();
  let content = 'Application Logs Export\n';
  content += `Exported: ${getTimestamp()}\n`;
  content += '='.repeat(80) + '\n\n';

  logs.forEach(log => {
    content += `[${log.timestamp}] [${log.level}] ${log.message}\n`;
    if (log.data) {
      content += `Data: ${JSON.stringify(log.data, null, 2)}\n`;
    }
    content += '-'.repeat(80) + '\n';
  });

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Export logs as JSON
 */
const exportLogsAsJson = (filename = 'app-logs.json') => {
  const logs = getLogs();
  const content = JSON.stringify(logs, null, 2);

  const element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Clear all logs
 */
const clearLogs = () => {
  try {
    localStorage.removeItem('appLogs');
    info('Logs cleared');
  } catch (error) {
    console.error('Failed to clear logs:', error);
  }
};

/**
 * Get logging statistics
 */
const getLogStatistics = () => {
  const logs = getLogs();
  const stats = {
    total: logs.length,
    debug: logs.filter(l => l.level === 'DEBUG').length,
    info: logs.filter(l => l.level === 'INFO').length,
    warn: logs.filter(l => l.level === 'WARN').length,
    error: logs.filter(l => l.level === 'ERROR').length
  };
  return stats;
};

/**
 * Print logs to console table
 */
const printLogsTable = () => {
  const logs = getLogs();
  const tableData = logs.map(log => ({
    Time: log.timestamp,
    Level: log.level,
    Message: log.message,
    Data: log.data ? JSON.stringify(log.data) : '-'
  }));
  console.table(tableData);
};

export default {
  debug,
  info,
  warn,
  error,
  logApiRequest,
  logApiResponse,
  logUserAction,
  logPageNavigation,
  logComponentLifecycle,
  logFormSubmission,
  getLogs,
  getLogsByLevel,
  getLogsByMessage,
  exportLogs,
  exportLogsAsJson,
  clearLogs,
  getLogStatistics,
  printLogsTable
};
