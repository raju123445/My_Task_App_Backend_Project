# Logging System Quick Reference

## Server Log Files Overview

| File | Purpose | Location |
|------|---------|----------|
| `reqLog.txt` | All HTTP requests | `server/logs/reqLog.txt` |
| `apiLog.txt` | API endpoint calls | `server/logs/apiLog.txt` |
| `authLog.txt` | Authentication events | `server/logs/authLog.txt` |
| `taskLog.txt` | Task operations | `server/logs/taskLog.txt` |
| `dbLog.txt` | Database operations | `server/logs/dbLog.txt` |
| `errorLog.txt` | Error tracking | `server/logs/errorLog.txt` |
| `activityLog.txt` | User activities | `server/logs/activityLog.txt` |
| `performanceLog.txt` | API performance metrics | `server/logs/performanceLog.txt` |

---

## Log Entry Format

### Request Log
```
[MM/DD/YYYY HH:MM:SS] [HTTP] METHOD URL ORIGIN
```

### API Log
```
[MM/DD/YYYY HH:MM:SS] [API] METHOD /api/endpoint - IP: CLIENT_IP
```

### Auth Log
```
[MM/DD/YYYY HH:MM:SS] [AUTH] METHOD /api/auth/endpoint
```

### Task Log
```
[MM/DD/YYYY HH:MM:SS] [TASK] METHOD /api/tasks/endpoint
```

### DB Log
```
[MM/DD/YYYY HH:MM:SS] [STATUS] OPERATION on MODEL: {JSON_DETAILS}
```

### Error Log
```
[MM/DD/YYYY HH:MM:SS] [ERROR] MESSAGE | Route: METHOD URL | Stack: STACK_TRACE
```

### Activity Log
```
USER: USER_ID | Action: ACTION_NAME | Details: {JSON_DETAILS}
```

### Performance Log
```
[MM/DD/YYYY HH:MM:SS] METHOD /api/endpoint | Duration: XXXms | Status: HTTP_CODE
```

---

## Server Logger Functions

### In Controllers
```javascript
const { logDatabaseOperation, logUserActivity } = require('../utils/logger');

// Database operation
logDatabaseOperation('CREATE', 'Task', { title: 'Task Name' }, 'SUCCESS');
logDatabaseOperation('UPDATE', 'User', { email: 'user@example.com' }, 'SUCCESS');
logDatabaseOperation('DELETE', 'Post', { _id: 'postId123' }, 'FAILURE');

// User activity
logUserActivity(req.user._id, 'LOGIN', { timestamp: new Date() });
logUserActivity(req.user._id, 'TASK_CREATED', { taskId: task._id });
logUserActivity(req.user._id, 'PROFILE_UPDATED', { field: 'email' });
```

### In Middleware
```javascript
const { errorLogger } = require('../utils/logger');

// Apply error logging middleware
app.use(errorLogger);
```

---

## Client Logger Functions

### Basic Logging
```javascript
import logger from './utils/logger';

logger.debug('Debug message', { data: 'value' });
logger.info('Info message', { data: 'value' });
logger.warn('Warning message', { data: 'value' });
logger.error('Error message', { data: 'value' });
```

### API Logging
```javascript
logger.logApiRequest('GET', '/api/tasks', null);
logger.logApiResponse('GET', '/api/tasks', 200, { count: 5 });
```

### User Action Logging
```javascript
logger.logUserAction('LOGIN', { email: 'user@example.com' });
logger.logUserAction('TASK_CREATED', { taskId: 'abc123' });
logger.logUserAction('FORM_SUBMITTED', { form: 'contactForm' });
```

### Navigation Logging
```javascript
logger.logPageNavigation('/tasks', '/dashboard');
logger.logPageNavigation('/login', '/register');
```

### Component Lifecycle
```javascript
logger.logComponentLifecycle('TaskComponent', 'MOUNTED');
logger.logComponentLifecycle('TaskComponent', 'UNMOUNTED');
```

### Form Submission
```javascript
logger.logFormSubmission('loginForm', { email: 'user@example.com' });
```

---

## Client Log Management

### Access Logs
```javascript
// Get all logs
const logs = logger.getLogs();

// Get by level
const errors = logger.getLogsByLevel('ERROR');
const warnings = logger.getLogsByLevel('WARN');

// Search logs
const results = logger.getLogsByMessage('API');

// Statistics
const stats = logger.getLogStatistics();
// Returns: { total: 125, debug: 10, info: 80, warn: 25, error: 10 }

// Print as table
logger.printLogsTable();
```

### Export Logs
```javascript
// Export as TXT file
logger.exportLogs('app-logs.txt');

// Export as JSON file
logger.exportLogsAsJson('app-logs.json');
```

### Maintenance
```javascript
// Clear all logs
logger.clearLogs();
```

---

## Common Commands

### View Server Logs (Linux/Mac/WSL)

```bash
# View latest 50 lines of request log
tail -50 server/logs/reqLog.txt

# Watch requests in real-time
tail -f server/logs/reqLog.txt

# View all errors
cat server/logs/errorLog.txt

# Count total API calls
wc -l server/logs/apiLog.txt

# Find specific user activity
grep "USER: 64a1b2c3d4e5f6" server/logs/activityLog.txt

# Find slow requests (>300ms)
grep -E "[3-9][0-9]{2}ms|[1-9][0-9]{3,}ms" server/logs/performanceLog.txt

# Get today's logs
grep "$(date +%m/%d/%Y)" server/logs/errorLog.txt

# Find failed operations
grep "FAILURE" server/logs/dbLog.txt
```

### View Client Logs (Browser Console)

```javascript
// Import logger first
import logger from './utils/logger';

// View all logs
logger.getLogs();

// View errors only
logger.getLogsByLevel('ERROR');

// Search for API calls
logger.getLogsByMessage('API');

// View stats
console.table(logger.getLogStatistics());

// Print formatted table
logger.printLogsTable();

// Download as file
logger.exportLogsAsJson();
```

---

## Log File Sizes & Cleanup

### Estimated Monthly Size
- `reqLog.txt`: ~2-5 MB (all HTTP requests)
- `apiLog.txt`: ~1-3 MB (API calls)
- `authLog.txt`: ~500 KB (auth operations)
- `taskLog.txt`: ~1-2 MB (task operations)
- `dbLog.txt`: ~2-4 MB (database operations)
- `errorLog.txt`: ~100-500 KB (errors)
- `activityLog.txt`: ~1-2 MB (user activities)
- `performanceLog.txt`: ~2-4 MB (performance data)

### Cleanup Strategy
```bash
# Archive logs older than 30 days
find server/logs -type f -mtime +30 -exec gzip {} \;

# Delete archived logs older than 90 days
find server/logs -name "*.gz" -mtime +90 -delete

# Clear old client logs (in browser console)
logger.clearLogs();
```

---

## Integration Examples

### Example 1: Logging Task Creation
```javascript
// In taskController.js
const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    
    // Log database operation
    logDatabaseOperation('CREATE', 'Task', 
      { _id: task._id, title: task.title }, 
      'SUCCESS'
    );
    
    // Log user activity
    logUserActivity(req.user._id, 'TASK_CREATED', 
      { taskId: task._id, title: task.title }
    );
    
    res.status(201).json(task);
  } catch (error) {
    logDatabaseOperation('CREATE', 'Task', req.body, 'FAILURE');
    res.status(400).json({ error: error.message });
  }
};
```

### Example 2: Logging User Login
```javascript
// In Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  
  logger.logFormSubmission('loginForm', { email: formData.email });
  
  const result = await login(formData);
  
  if (result.success) {
    logger.logUserAction('LOGIN', { email: formData.email });
    logger.logPageNavigation('/login', '/dashboard');
    navigate('/dashboard');
  } else {
    logger.error('Login failed', { message: result.error });
  }
};
```

### Example 3: Component with Logging
```javascript
// In UserTasks.jsx
import { useComponentLogger } from '../hooks/useComponentLogger';

export default function UserTasks() {
  const { logAction } = useComponentLogger('UserTasks');
  
  const handleStatusChange = (taskId, newStatus) => {
    logAction('STATUS_CHANGED', { taskId, newStatus });
    updateTask(taskId, { status: newStatus });
  };
  
  return (
    // Component JSX
  );
}
```

---

## Troubleshooting

### Problem: No logs in files
**Check**: 
- Directory exists: `server/logs/`
- File permissions are writable
- Server has restarted after changes

### Problem: Client logs not saving
**Check**:
- localStorage is enabled
- Browser allows localStorage
- Storage quota not exceeded (usually 5-10MB)

### Problem: Logs file too large
**Solution**:
- Implement log rotation
- Archive old logs
- Delete logs older than 90 days

### Problem: Can't find specific log
**Solution**:
```bash
# Search across all logs
grep "SEARCH_TERM" server/logs/*.txt

# Find in date range
grep "11/11/2025" server/logs/apiLog.txt
```

---

## Performance Considerations

### Server Logging
- Minimal performance impact (~1-2ms per request)
- File I/O is asynchronous
- Consider log rotation for large deployments

### Client Logging
- localStorage limited to ~5-10MB
- Auto-cleanup after 500 logs
- Use `clearLogs()` periodically in production

---

## Security

### What's Logged
- ✅ API endpoints and methods
- ✅ User IDs (not emails in logs)
- ✅ Error messages
- ✅ Performance metrics

### What's NOT Logged
- ❌ Passwords
- ❌ JWT tokens
- ❌ Sensitive API payloads
- ❌ Credit card information

### Best Practices
1. Don't log sensitive data
2. Restrict log file access
3. Archive logs regularly
4. Monitor for suspicious patterns
5. Use HTTPS for all connections

---

## Quick Start

### Enable logging in your code:

**Server:**
```javascript
// Already setup in server.js
// Just use the functions in controllers
```

**Client:**
```javascript
import logger from './utils/logger';

// Start logging
logger.info('Component loaded');
logger.logUserAction('BUTTON_CLICKED', { buttonId: 'submit' });
```

**That's it!** Logs are automatically saved and available.

---

**Version**: 1.0  
**Last Updated**: November 12, 2025  
**For detailed info, see**: LOGGING_SYSTEM.md
