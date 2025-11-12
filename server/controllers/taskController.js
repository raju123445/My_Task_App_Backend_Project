const Task = require('../models/Task');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all tasks (admin can see all, users see only assigned)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let tasks;

  if (req.user.role === 'admin') {
    // Admin can see all tasks
    tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
  } else {
    // Users can only see their assigned tasks
    tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('assignedBy', 'name email')
    .populate('comments.userId', 'name email');

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user is authorized to view this task
  if (req.user.role !== 'admin' && task.assignedTo._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this task');
  }

  res.json({
    success: true,
    data: task
  });
});

// @desc    Create a new task (Admin only)
// @route   POST /api/tasks
// @access  Private/Admin
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;

  // Verify user exists
  const user = await User.findById(assignedTo);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user._id,
    dueDate,
    priority: priority || 'medium'
  });

  await task.populate('assignedTo', 'name email');
  await task.populate('assignedBy', 'name email');

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update task (Admin can update all, users can update status/comments)
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check authorization
  if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Users can only update status, admins can update anything
  if (req.user.role === 'user') {
    const { status } = req.body;
    if (status && ['pending', 'in-progress', 'completed', 'on-hold'].includes(status)) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
  } else {
    // Admin can update all fields
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.priority = req.body.priority || task.priority;
    task.status = req.body.status || task.status;
    if (req.body.status === 'completed' && task.status === 'completed') {
      task.completedAt = new Date();
    }
  }

  const updatedTask = await task.save();
  await updatedTask.populate('assignedTo', 'name email');
  await updatedTask.populate('assignedBy', 'name email');

  res.json({
    success: true,
    data: updatedTask
  });
});

// @desc    Delete task (Admin only)
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Task.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comment
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check authorization
  if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to comment on this task');
  }

  task.comments.push({
    userId: req.user._id,
    comment
  });

  const updatedTask = await task.save();
  await updatedTask.populate('comments.userId', 'name email');

  res.json({
    success: true,
    data: updatedTask
  });
});

// @desc    Get statistics (Admin only)
// @route   GET /api/tasks/stats
// @access  Private/Admin
const getTaskStats = asyncHandler(async (req, res) => {
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const pendingTasks = await Task.countDocuments({ status: 'pending' });
  const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });

  const tasksByPriority = await Task.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      tasksByPriority
    }
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats
};
