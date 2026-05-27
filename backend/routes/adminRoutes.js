const express = require('express');
const router  = express.Router();

const {
  getAdminDashboard,
  getAllUsers,
  toggleUserStatus,
  addDoctor,
  getAllDoctors,
  verifyDoctor,
  updateDoctor,
  getAllAppointments,
  cancelAppointment,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadProfile, cloudinaryUploadMiddleware } = require('../config/cloudinary');

const uploadProfileMiddleware = [
  uploadProfile.single('profileImage'),
  cloudinaryUploadMiddleware('dabms/profiles'),
];

// All admin routes are protected
router.use(protect, adminOnly);

router.get('/dashboard',               getAdminDashboard);

router.get('/users',                   getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

router.get('/doctors',                 getAllDoctors);
router.post('/doctors',                ...uploadProfileMiddleware, addDoctor);
router.put('/doctors/:id',             updateDoctor);
router.put('/doctors/:id/verify',      verifyDoctor);

router.get('/appointments',            getAllAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);

module.exports = router;
