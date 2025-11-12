const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  getTaskStats
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');
const roleAuth = require('../middleware/roleMiddleware');

const router = express.Router();

// Get stats (admin only)
router.get('/stats', protect, admin, getTaskStats);

// Get all tasks and create new task
router.route('/').get(protect, getTasks).post(protect, admin, createTask);

// Get, update, delete single task
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, admin, deleteTask);

// Add comment to task
router.post('/:id/comment', protect, addComment);

module.exports = router;
