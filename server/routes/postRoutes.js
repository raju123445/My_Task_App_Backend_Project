const express = require('express');
const { 
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createPostValidation, updatePostValidation } = require('../validations/postValidation');

const router = express.Router();

router.route('/').get(protect, getPosts).post(protect, validate(createPostValidation), createPost);
router.route('/:id').get(protect, getPostById).put(protect, validate(updatePostValidation), updatePost).delete(protect, deletePost);

module.exports = router;