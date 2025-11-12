const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const { logDatabaseOperation, logUserActivity } = require('../utils/logger');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    logDatabaseOperation('READ', 'User', { email }, 'DUPLICATE_FOUND');
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    logDatabaseOperation('CREATE', 'User', 
      { _id: user._id, name: user.name, email: user.email, role: user.role }, 
      'SUCCESS'
    );
    logUserActivity(user._id, 'REGISTER', { email: user.email, name: user.name });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } else {
    logDatabaseOperation('CREATE', 'User', req.body, 'FAILURE');
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    logDatabaseOperation('READ', 'User', { email }, 'SUCCESS');
    logUserActivity(user._id, 'LOGIN', { email: user.email, role: user.role });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      token: generateToken(user._id)
    });
  } else {
    logDatabaseOperation('READ', 'User', { email }, 'AUTHENTICATION_FAILED');
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    logDatabaseOperation('READ', 'User', { _id: user._id }, 'SUCCESS');
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio
    });
  } else {
    logDatabaseOperation('READ', 'User', { _id: req.user._id }, 'NOT_FOUND');
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const oldData = { name: user.name, email: user.email, bio: user.bio };
    
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;
    user.bio = req.body.bio || user.bio;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    logDatabaseOperation('UPDATE', 'User', 
      { _id: updatedUser._id, fields: ['name', 'email', 'avatar', 'bio'] }, 
      'SUCCESS'
    );
    logUserActivity(updatedUser._id, 'PROFILE_UPDATED', 
      { oldData, newData: { name: updatedUser.name, email: updatedUser.email } }
    );

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio
    });
  } else {
    logDatabaseOperation('UPDATE', 'User', { _id: req.user._id }, 'NOT_FOUND');
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};