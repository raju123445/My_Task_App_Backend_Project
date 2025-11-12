# Testing Guide - Admin & Task Management System

## 🧪 Pre-Testing Setup

### Prerequisites
- ✅ MongoDB running locally
- ✅ Backend server running on port 5000
- ✅ Frontend running on port 5173 (or configured port)
- ✅ Node modules installed for both server and client

### Test Data Setup

1. **Register Test Users**
   ```
   User 1 (Will be Admin):
   - Name: Admin User
   - Email: admin@example.com
   - Password: password123
   
   User 2 (Regular User):
   - Name: John Developer
   - Email: john@example.com
   - Password: password123
   
   User 3 (Another Regular User):
   - Name: Jane Tester
   - Email: jane@example.com
   - Password: password123
   ```

2. **Make First User Admin**
   ```bash
   # In MongoDB/Compass:
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

---

## 🧪 Test Cases

### Test 1: Admin Login & Dashboard Access
**Objective**: Verify admin can login and access admin dashboard

**Steps**:
1. Navigate to Login page
2. Enter admin credentials:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click Sign In

**Expected Results**:
- ✅ Login successful
- ✅ Redirected to Dashboard
- ✅ User role shows "admin" in sidebar
- ✅ Admin Dashboard link appears in sidebar
- ✅ Can access `/admin-dashboard` route

**Test Code**:
```javascript
// Check if admin dashboard link appears
cy.contains('Admin Dashboard').should('be.visible');

// Check role display
cy.contains('admin').should('be.visible');
```

---

### Test 2: Create Task (Admin)
**Objective**: Verify admin can create and assign tasks

**Steps**:
1. Login as admin
2. Navigate to Admin Dashboard
3. Click "Create New Task" button
4. Fill form:
   - Title: "Fix Login Bug"
   - Description: "There's a bug in the login validation that needs fixing"
   - Assign To: "John Developer"
   - Priority: "High"
   - Due Date: (Select date 7 days from now)
5. Click "Create Task"

**Expected Results**:
- ✅ Task creation form appears
- ✅ Form has all required fields
- ✅ User dropdown populated with registered users
- ✅ Priority options available (Low, Medium, High, Urgent)
- ✅ Date picker functional
- ✅ Success message displayed
- ✅ Task appears in tasks table immediately
- ✅ Task status is "pending"

**Verification**:
```javascript
// Check task in table
cy.get('table tbody').should('contain', 'Fix Login Bug');
cy.get('table tbody').should('contain', 'John Developer');
cy.get('table tbody').should('contain', 'High');
```

---

### Test 3: Create Multiple Tasks
**Objective**: Verify admin can create multiple tasks with different priorities

**Steps**:
1. Create 3 more tasks with different priorities:
   - Task 2: Priority "Medium", Assign to "Jane Tester"
   - Task 3: Priority "Low", Assign to "John Developer"
   - Task 4: Priority "Urgent", Assign to "Jane Tester"

**Expected Results**:
- ✅ All 4 tasks visible in table
- ✅ Each shows correct priority color-coding:
   - Urgent: Red
   - High: Orange
   - Medium: Yellow
   - Low: Green
- ✅ Task stats updated (Total: 4)

**Verification**:
```javascript
// Check all tasks present
cy.get('table tbody tr').should('have.length', 4);

// Verify color coding
cy.get('table tbody tr:first').within(() => {
  cy.contains('Urgent').should('have.class', 'bg-red');
});
```

---

### Test 4: User Receives Task (User Login)
**Objective**: Verify assigned user can see their tasks

**Steps**:
1. Logout from admin account
2. Login as "John Developer":
   - Email: `john@example.com`
   - Password: `password123`
3. Check Dashboard
4. Navigate to Tasks page

**Expected Results**:
- ✅ Login successful
- ✅ Dashboard shows task summary:
   - Total Tasks: 2 (or however many assigned)
   - Completed: 0
   - In Progress: 0
   - Pending: 2
- ✅ "View My Tasks" button visible
- ✅ Tasks page shows only assigned tasks (not all)
- ✅ Can see task titles and descriptions

**Verification**:
```javascript
// Check task stats on dashboard
cy.contains('Total Tasks:').parent().contains('2');

// Navigate to tasks
cy.contains('View My Tasks').click();

// Verify task count
cy.get('[class*="task"]').should('have.length.gte', 2);
```

---

### Test 5: Filter Tasks by Status
**Objective**: Verify filtering works correctly

**Steps**:
1. On Tasks page, observe status filter buttons
2. Click "Pending" filter
3. Click "In Progress" filter
4. Click "Completed" filter
5. Click "All" filter

**Expected Results**:
- ✅ Pending button shows active state
- ✅ Only pending tasks displayed (all should be pending initially)
- ✅ Task count updates: "Showing X task(s)"
- ✅ In Progress filter shows no tasks
- ✅ Completed filter shows no tasks
- ✅ All filter shows all tasks again

**Test Code**:
```javascript
// Filter by pending
cy.contains('button', 'pending').click();
cy.contains('Showing 2 task(s)').should('be.visible');

// Filter by in-progress
cy.contains('button', 'in-progress').click();
cy.contains('Showing 0 task(s)').should('be.visible');
```

---

### Test 6: Update Task Status
**Objective**: Verify user can change task status

**Steps**:
1. Click on first task in list
2. Task details panel appears on right
3. Click "In Progress" status button
4. Observe status change
5. Click "Completed" status button

**Expected Results**:
- ✅ Task details panel opens
- ✅ All status buttons visible: pending, in-progress, completed, on-hold
- ✅ Current status button highlighted (blue)
- ✅ Status updates immediately when clicked
- ✅ Status persists after page refresh
- ✅ Assigned date updates when completed

**Verification**:
```javascript
// Click on task
cy.get('[class*="task"]').first().click();

// Click in-progress button
cy.contains('button', 'in-progress').click();

// Verify status changed
cy.contains('in-progress').should('have.class', 'bg-blue');

// Refresh page
cy.reload();

// Verify status persisted
cy.contains('in-progress').should('have.class', 'bg-blue');
```

---

### Test 7: Add Comment to Task
**Objective**: Verify users can comment on tasks

**Steps**:
1. Task details panel should be open
2. Scroll to Comments section
3. Type comment: "I've started working on this task"
4. Press Enter or click Send button
5. Add another comment: "Almost done, should finish by tomorrow"

**Expected Results**:
- ✅ Comments section visible with "No comments yet" initially
- ✅ Comment input field present
- ✅ First comment appears with:
   - User name
   - Comment text
   - Date/time
- ✅ Second comment appears above first (newest first)
- ✅ Comments persist after page refresh

**Verification**:
```javascript
// Type and send comment
cy.get('input[placeholder="Add a comment..."]')
  .type('I\'ve started working on this task');
cy.get('button').contains('Send').click();

// Verify comment appears
cy.contains("I've started working").should('be.visible');
cy.contains('John Developer').should('be.visible');
```

---

### Test 8: Admin Views User Task Updates
**Objective**: Verify admin can see task status changes

**Steps**:
1. Logout from user account
2. Login as admin
3. Go to Admin Dashboard
4. Look for task assigned to John

**Expected Results**:
- ✅ Admin can see task
- ✅ Task shows current status (In Progress)
- ✅ Task shows correct priority and due date
- ✅ Stats updated:
   - In Progress count increased
   - Pending count decreased

**Verification**:
```javascript
// Navigate to admin dashboard
cy.visit('/admin-dashboard');

// Find task in table
cy.get('table').should('contain', 'Fix Login Bug');

// Verify status shows correctly
cy.get('table tbody').within(() => {
  cy.contains('in-progress').should('be.visible');
});
```

---

### Test 9: Complete Task
**Objective**: Verify task completion workflow

**Steps**:
1. Login as user
2. Go to Tasks page
3. Click on task with "In Progress" status
4. Click "Completed" status button

**Expected Results**:
- ✅ Status changes to "Completed"
- ✅ Completed date is set
- ✅ Task appears in "Completed" filter
- ✅ Task count in dashboard updates

**Verification**:
```javascript
// Complete task
cy.contains('button', 'completed').click();

// Filter by completed
cy.contains('button', 'completed').click();

// Verify task appears
cy.get('[class*="task"]').should('contain', 'completed');
```

---

### Test 10: Delete Task (Admin)
**Objective**: Verify admin can delete tasks

**Steps**:
1. Login as admin
2. Go to Admin Dashboard
3. Look for a task to delete (e.g., low priority one)
4. Find delete option (usually in actions column or right-click)

**Expected Results**:
- ✅ Delete button/option available
- ✅ Confirmation dialog appears (if implemented)
- ✅ Task removed from table
- ✅ User no longer sees task
- ✅ Stats updated

**Note**: May need to implement delete UI in AdminDashboard if not visible

---

### Test 11: Permission Check - Regular User Cannot Create Tasks
**Objective**: Verify access control works

**Steps**:
1. Login as regular user (john@example.com)
2. Try to navigate to `/admin-dashboard`
3. Try to access `/admin-dashboard` via URL

**Expected Results**:
- ✅ Sidebar doesn't show "Admin Dashboard" link
- ✅ Cannot access `/admin-dashboard` - redirected to `/dashboard`
- ✅ Cannot access create task form

---

### Test 12: Permission Check - Regular User Cannot See All Tasks
**Objective**: Verify data filtering by role

**Steps**:
1. Create a task assigned to Jane
2. Login as John
3. Go to Tasks page

**Expected Results**:
- ✅ John only sees tasks assigned to him (not Jane's tasks)
- ✅ API call `/api/tasks` returns only John's tasks

**Verification**:
```javascript
// Open DevTools Network tab
// Check /api/tasks response
// Should not contain tasks assigned to other users
```

---

### Test 13: Task Statistics (Admin)
**Objective**: Verify admin statistics display

**Steps**:
1. Login as admin
2. Go to Admin Dashboard
3. Observe statistics cards at top

**Expected Results**:
- ✅ 4 stat cards visible:
   - Total Tasks: Shows total count
   - Completed: Shows completed count
   - In Progress: Shows in-progress count
   - Pending: Shows pending count
- ✅ Numbers update as tasks are modified

**Expected Values**:
```
If 4 tasks created and John completed 1:
- Total: 4
- Completed: 1
- In Progress: 1 (from John's other task)
- Pending: 2 (Jane's tasks)
```

---

### Test 14: Dark Mode Support
**Objective**: Verify dark theme works for new components

**Steps**:
1. Toggle theme (click moon/sun icon)
2. Check Admin Dashboard in dark mode
3. Check Tasks page in dark mode

**Expected Results**:
- ✅ All colors properly inverted
- ✅ Text readable in both themes
- ✅ Tables properly styled
- ✅ Buttons visible and clickable

---

### Test 15: Responsive Design
**Objective**: Verify mobile responsiveness

**Steps**:
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test on mobile sizes:
   - iPhone 12 (390x844)
   - iPad (768x1024)
   - Desktop (1920x1080)

**Expected Results**:
- ✅ Admin Dashboard responsive
- ✅ Task list stacks on mobile
- ✅ Task details visible on small screens
- ✅ Forms fill full width
- ✅ Sidebar collapses on mobile

---

## 🔍 API Testing with Network Tab

### Check API Calls
1. Open DevTools → Network tab
2. Perform actions and observe API calls:

```
GET /api/tasks
Headers: Authorization: Bearer <TOKEN>
Response: { success: true, data: [...], count: 4 }

POST /api/tasks
Body: { title, description, assignedTo, dueDate, priority }
Response: { success: true, data: {...} }

PUT /api/tasks/:id
Body: { status: "in-progress" }
Response: { success: true, data: {...} }

POST /api/tasks/:id/comment
Body: { comment: "comment text" }
Response: { success: true, data: {...} }
```

---

## 📊 Test Results Template

### Test Execution Report

| Test # | Name | Steps | Result | Notes |
|--------|------|-------|--------|-------|
| 1 | Admin Login | 3 | ✅ PASS | - |
| 2 | Create Task | 5 | ✅ PASS | - |
| 3 | Multiple Tasks | 4 | ✅ PASS | - |
| 4 | User Receives Task | 4 | ✅ PASS | - |
| 5 | Filter Tasks | 5 | ✅ PASS | - |
| 6 | Update Status | 5 | ✅ PASS | - |
| 7 | Add Comment | 5 | ✅ PASS | - |
| 8 | Admin Sees Updates | 4 | ✅ PASS | - |
| 9 | Complete Task | 4 | ✅ PASS | - |
| 10 | Delete Task | 4 | ⏳ PENDING | Need to implement UI |
| 11 | Permission Check | 3 | ✅ PASS | - |
| 12 | Data Filtering | 3 | ✅ PASS | - |
| 13 | Statistics | 3 | ✅ PASS | - |
| 14 | Dark Mode | 3 | ✅ PASS | - |
| 15 | Responsive | 5 | ✅ PASS | - |

**Overall Result**: 14/15 PASS ✅

---

## 🐛 Debugging Tips

### If task doesn't appear for user:
```bash
# Check MongoDB
db.tasks.findOne({ assignedTo: ObjectId("user_id") })

# Check browser console
console.log('Tasks:', tasks);

# Check API response in Network tab
```

### If status update doesn't work:
```javascript
// Check if token is still valid
console.log(localStorage.getItem('token'));

// Check API response
console.log('Update response:', response);
```

### If comment not saving:
```javascript
// Verify task ID
console.log('Task ID:', selectedTask._id);

// Check API error
```

---

## ✅ Final Verification Checklist

- [ ] Admin can create tasks
- [ ] Users can see assigned tasks
- [ ] Task status updates work
- [ ] Comments save and display
- [ ] Admin stats update correctly
- [ ] Filtering works by status
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] API calls successful
- [ ] No console errors
- [ ] Permissions enforced
- [ ] Data persists on refresh

**If all checked**: System is ready for production! 🎉
