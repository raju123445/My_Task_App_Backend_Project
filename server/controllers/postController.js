const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
const getPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', category = '' } = req.query;
  
  // Build filter object
  const filter = {};
  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }
  
  // For regular users, only show their posts
  if (req.user.role !== 'admin') {
    filter.author = req.user._id;
  }
  
  const posts = await Post.find(filter)
    .populate('author', 'name email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  
  // Get total count for pagination
  const total = await Post.countDocuments(filter);
  
  res.json({
    posts,
    totalPages: Math.ceil(total / limit),
    currentPage: Number(page),
    total
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  
  if (post) {
    // Check if user is author or admin
    if (post.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to access this post');
    }
    
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  
  const post = new Post({
    title,
    content,
    category,
    author: req.user._id
  });
  
  const createdPost = await post.save();
  const populatedPost = await Post.findById(createdPost._id).populate('author', 'name email');
  
  res.status(201).json(populatedPost);
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (post) {
    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this post');
    }
    
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.isCompleted = req.body.isCompleted !== undefined ? req.body.isCompleted : post.isCompleted;
    
    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name email');
    
    res.json(populatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (post) {
    // Check if user is author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this post');
    }
    
    await post.remove();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};