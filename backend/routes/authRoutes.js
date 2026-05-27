const express = require('express');
const router  = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { uploadProfile, cloudinaryUploadMiddleware } = require('../config/cloudinary');

const uploadProfileMiddleware = [
  uploadProfile.single('profileImage'),
  cloudinaryUploadMiddleware('dabms/profiles'),
];

// Public routes
router.post('/register',             register);
router.post('/login',                login);
router.post('/forgot-password',      forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me',             protect, getMe);
router.put('/update-profile', protect, ...uploadProfileMiddleware, updateProfile);
router.put('/change-password',protect, changePassword);

module.exports = router;
