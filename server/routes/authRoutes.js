const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { 
  registerValidation, 
  loginValidation, 
  updateProfileValidation 
} = require('../validations/authValidation');

const router = express.Router();

router.route('/register').post(validate(registerValidation), registerUser);
router.route('/login').post(validate(loginValidation), loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, validate(updateProfileValidation), updateUserProfile);

module.exports = router;