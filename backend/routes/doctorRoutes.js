const express = require('express');
const router  = express.Router();

const {
  getDoctors,
  getDoctorById,
  getDoctorDashboard,
  getDoctorAppointments,
  updateDoctorProfile,
  updateSlots,
  completeAppointment,
  cancelAppointment,
  getSpecialities,
  getDoctorPatients,
  getPatientHistory,
} = require('../controllers/doctorController');

const { protect, doctorOnly } = require('../middleware/authMiddleware');
const { uploadProfile, cloudinaryUploadMiddleware } = require('../config/cloudinary');

const uploadProfileMiddleware = [
  uploadProfile.single('profileImage'),
  cloudinaryUploadMiddleware('dabms/profiles'),
];

// Public routes
router.get('/list',         getDoctors);
  router.get('/specialities', getSpecialities);
router.get('/:id',          getDoctorById);

// Protected doctor-only routes
router.get('/me/dashboard',                protect, doctorOnly, getDoctorDashboard);
 router.get('/me/appointments',             protect, doctorOnly, getDoctorAppointments);
    router.put('/me/update-profile',           protect, doctorOnly, ...uploadProfileMiddleware, updateDoctorProfile);
     router.put('/me/slots',                    protect, doctorOnly, updateSlots);
router.put('/me/appointment/:id/complete', protect, doctorOnly, completeAppointment);
 router.put('/me/appointment/:id/cancel',    protect, doctorOnly, cancelAppointment);
 router.get('/me/patients',                  protect, doctorOnly, getDoctorPatients);
router.get('/me/patient/:patientId/history', protect, doctorOnly, getPatientHistory);

module.exports = router;
